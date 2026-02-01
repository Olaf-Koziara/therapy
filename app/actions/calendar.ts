'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAppointments(start: Date, end: Date) {
  const user = await getCurrentUser();

  return db.appointment.findMany({
    where: {
      tenantId: user.tenantId,
      startDateTime: {
        gte: start,
        lte: end
      }
    },
    include: {
      patient: true
    },
    orderBy: {
      startDateTime: 'asc'
    }
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
    return { success: false, error: "Błąd bazy danych przy tworzeniu wizyty." };
  }
}

export async function deleteAppointment(id: string) {
    const user = await getCurrentUser();
    try {
        await db.appointment.delete({
            where: {
                id,
                tenantId: user.tenantId // Security check
            }
        });
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error) {
        console.error("Delete Appointment Error:", error);
        return { success: false, error: "Nie udało się usunąć wizyty." };
    }
}

export async function updateAppointment(id: string, data: Partial<CreateAppointmentData>) {
    const user = await getCurrentUser();

    // If dates are changing, check for conflicts
    if (data.startDateTime && data.endDateTime) {
         if (data.startDateTime >= data.endDateTime) {
            return { success: false, error: "Data zakończenia musi być później niż data rozpoczęcia" };
        }

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
            where: {
                id,
                tenantId: user.tenantId
            },
            data: {
                ...data
            }
        });
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error) {
        console.error("Update Appointment Error:", error);
        return { success: false, error: "Nie udało się zaktualizować wizyty." };
    }
}
