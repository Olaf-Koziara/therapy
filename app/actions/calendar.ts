'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { decrypt } from "@/lib/encryption";

export async function getAppointments(start: Date, end: Date) {
  const user = await getCurrentUser();

  const appointments = await db.appointment.findMany({
    where: {
      tenantId: user.tenantId,
      startDateTime: {
        gte: start,
        lte: end
      }
    },
    include: {
      patient: true,
      note: true
    },
    orderBy: {
      startDateTime: 'asc'
    }
  });

  return appointments.map(app => {
      let decryptedNote = null;
      if (app.note) {
          try {
              decryptedNote = {
                  ...app.note,
                  content: decrypt(app.note.content)
              };
          } catch (e) {
              console.error(`Failed to decrypt note for appointment ${app.id}`, e);
              decryptedNote = {
                  ...app.note,
                  content: "[Błąd deszyfrowania]"
              };
          }
      }

      return {
          ...app,
          note: decryptedNote
      };
  });
}

export type CreateAppointmentData = {
  patientId: string;
  startDateTime: Date;
  endDateTime: Date;
  type: string;
  price: number;
}

export async function createAppointment(data: CreateAppointmentData) {
  const user = await getCurrentUser();

  // Basic validation
  if (data.startDateTime >= data.endDateTime) {
      return { success: false, error: "Data zakończenia musi być później niż data rozpoczęcia" };
  }

  // Conflict Check (Simple overlap)
  const conflicts = await db.appointment.findMany({
    where: {
        tenantId: user.tenantId,
        OR: [
            {
                startDateTime: { lt: data.endDateTime },
                endDateTime: { gt: data.startDateTime }
            }
        ]
    }
  });

  if (conflicts.length > 0) {
      return { success: false, error: "Konflikt terminów! W tym czasie istnieje już inna wizyta." };
  }

  try {
    const appointment = await db.appointment.create({
      data: {
        tenantId: user.tenantId,
        patientId: data.patientId,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        status: 'SCHEDULED',
        type: data.type,
        price: data.price,
      }
    });

    revalidatePath('/dashboard/calendar');
    return { success: true, appointment };
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return { success: false, error: "Błąd bazy danych przy tworzeniu wizyty: " + (error as Error).message };
  }
}

export async function updateAppointment(id: string, data: Partial<CreateAppointmentData>) {
    const user = await getCurrentUser();

    // Check ownership
    const existing = await db.appointment.findUnique({
        where: { id }
    });

    if (!existing || existing.tenantId !== user.tenantId) {
        return { success: false, error: "Nie znaleziono wizyty" };
    }

    // If updating time, check conflicts
    if (data.startDateTime && data.endDateTime) {
         const conflicts = await db.appointment.findMany({
            where: {
                tenantId: user.tenantId,
                id: { not: id }, // Exclude self
                OR: [
                    {
                        startDateTime: { lt: data.endDateTime },
                        endDateTime: { gt: data.startDateTime }
                    }
                ]
            }
        });
        if (conflicts.length > 0) {
            return { success: false, error: "Konflikt terminów!" };
        }
    }

    try {
        await db.appointment.update({
            where: { id },
            data: {
                ...data
            }
        });
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}

export async function deleteAppointment(id: string) {
    const user = await getCurrentUser();

    const existing = await db.appointment.findUnique({ where: { id } });
    if (!existing || existing.tenantId !== user.tenantId) {
        return { success: false, error: "Brak dostępu" };
    }

    try {
        await db.appointment.delete({ where: { id } });
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}
