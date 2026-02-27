'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { encrypt, decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function createNote({ patientId, content, appointmentId }: { patientId: string, content: string, appointmentId?: string }) {
    const user = await getCurrentUser();

    // Verify access to patient
    const patient = await db.patient.findUnique({
        where: { id: patientId, tenantId: user.tenantId }
    });

    if (!patient) return { success: false, error: "Pacjent nie znaleziony" };

    try {
        const encryptedContent = encrypt(content);

        const note = await db.note.create({
            data: {
                tenantId: user.tenantId,
                patientId,
                appointmentId: appointmentId || null,
                content: encryptedContent,
                version: 1
            }
        });

        revalidatePath(`/dashboard/patients/${patientId}`);
        if (appointmentId) revalidatePath('/dashboard/calendar');

        return { success: true, note };
    } catch (e) {
        console.error("Create Note Error:", e);
        return { success: false, error: "Błąd zapisu notatki: " + (e as Error).message };
    }
}

export async function getPatientNotes(patientId: string) {
    const user = await getCurrentUser();

    // Verify access
    const patient = await db.patient.findUnique({
        where: { id: patientId, tenantId: user.tenantId }
    });
    if (!patient) throw new Error("Pacjent nie znaleziony");

    const notes = await db.note.findMany({
        where: {
            patientId,
            tenantId: user.tenantId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            appointment: true
        }
    });

    return notes.map((note: any) => {
        try {
            return {
                ...note,
                content: decrypt(note.content)
            };
        } catch (e) {
            console.error("Decryption error for note " + note.id, e);
            return {
                ...note,
                content: "[Błąd deszyfrowania treści]"
            };
        }
    });
}

export async function getAppointmentNote(appointmentId: string) {
    const user = await getCurrentUser();

    const note = await db.note.findUnique({
        where: { appointmentId },
    });

    if (!note) return null;
    if (note.tenantId !== user.tenantId) return null;

    try {
        return {
            ...note,
            content: decrypt(note.content)
        };
    } catch (e) {
        return { ...note, content: "[Błąd deszyfrowania]" };
    }
}

export async function updateNote(noteId: string, content: string) {
    const user = await getCurrentUser();

    const existing = await db.note.findUnique({
        where: { id: noteId }
    });

    if (!existing || existing.tenantId !== user.tenantId) {
        return { success: false, error: "Brak dostępu" };
    }

    try {
        // 1. Archive current version to History
        await db.noteHistory.create({
            data: {
                noteId: existing.id,
                content: existing.content, // Already encrypted
                version: existing.version
            }
        });

        // 2. Encrypt new content
        const encryptedContent = encrypt(content);

        // 3. Update Note
        await db.note.update({
            where: { id: noteId },
            data: {
                content: encryptedContent,
                version: { increment: 1 }
            }
        });

        revalidatePath(`/dashboard/patients/${existing.patientId}`);
        if (existing.appointmentId) revalidatePath('/dashboard/calendar');

        return { success: true };
    } catch (e) {
        return { success: false, error: "Błąd aktualizacji" };
    }
}

export async function getNoteHistory(noteId: string) {
    const user = await getCurrentUser();
    const note = await db.note.findUnique({ where: { id: noteId }});

    if(!note || note.tenantId !== user.tenantId) return [];

    const history = await db.noteHistory.findMany({
        where: { noteId },
        orderBy: { version: 'desc' }
    });

    return history.map((h: any) => {
        try {
            return { ...h, content: decrypt(h.content) };
        } catch {
            return { ...h, content: "[Błąd]" };
        }
    });
}
