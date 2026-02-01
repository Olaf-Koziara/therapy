'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPatient(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    guardianName?: string;
    pesel?: string;
    birthDate?: string; // date string yyyy-mm-dd
    gdprConsent?: boolean;
}) {
    const user = await getCurrentUser();

    try {
        await db.patient.create({
            data: {
                tenantId: user.tenantId,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                guardianName: data.guardianName,
                pesel: data.pesel,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                gdprConsent: data.gdprConsent || false
            }
        });
        revalidatePath('/dashboard/patients');
        return { success: true };
    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}

export async function getPatients() {
    const user = await getCurrentUser();
    return db.patient.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { lastName: 'asc' }
    });
}

export async function getPatientById(id: string) {
    const user = await getCurrentUser();
    return db.patient.findUnique({
        where: { id, tenantId: user.tenantId },
        include: {
            appointments: {
                orderBy: { startDateTime: 'desc' },
                take: 50
            }
        }
    });
}
