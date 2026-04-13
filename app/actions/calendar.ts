'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { decrypt } from "@/lib/encryption";
import { addWeeks, addMonths, isBefore } from "date-fns";

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

  return appointments.map((app: any) => {
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
  recurrence?: {
      frequency: "WEEKLY";
      count?: number; // Optional count
      until?: Date;   // Optional end date
  };
}

export async function createAppointment(data: CreateAppointmentData) {
  const user = await getCurrentUser();

  // Basic validation
  if (data.startDateTime >= data.endDateTime) {
      return { success: false, error: "Data zakończenia musi być później niż data rozpoczęcia" };
  }

  // Determine appointments to create
  const appointmentsToCreate: { start: Date, end: Date }[] = [];

  if (data.recurrence) {
      let currentStart = new Date(data.startDateTime);
      let currentEnd = new Date(data.endDateTime);
      const limitDate = addMonths(new Date(), 6); // Max 6 months from now as per architecture spec
      const maxCount = 50; // Increased limit for user flexibility
      let count = 0;

      while (true) {
          // Check limits
          if (count >= maxCount) break;
          if (isBefore(limitDate, currentStart)) break;
          if (data.recurrence.count && count >= data.recurrence.count) break;
          if (data.recurrence.until && isBefore(data.recurrence.until, currentStart)) break;

          appointmentsToCreate.push({ start: new Date(currentStart), end: new Date(currentEnd) });

          // Next iteration
          currentStart = addWeeks(currentStart, 1);
          currentEnd = addWeeks(currentEnd, 1);
          count++;
      }
  } else {
      appointmentsToCreate.push({ start: data.startDateTime, end: data.endDateTime });
  }

  // Batch Conflict Check
  // We check if ANY of the new slots conflict with EXISTING slots.
  // This might be heavy for many slots, but for <20 it's fine for MVP.
  // Optimization: Check range min(start) to max(end) first? No, gaps allow valid slots.

  // We'll iterate and check conflicts. If any conflict, we abort whole operation (Transaction).
  const recurrenceId = data.recurrence ? crypto.randomUUID() : null;

  try {
      await db.$transaction(async (tx: any) => {
          for (const slot of appointmentsToCreate) {
             const conflicts = await tx.appointment.findMany({
                where: {
                    tenantId: user.tenantId,
                    OR: [
                        {
                            startDateTime: { lt: slot.end },
                            endDateTime: { gt: slot.start }
                        }
                    ]
                }
              });

              if (conflicts.length > 0) {
                  throw new Error(`Konflikt terminów dla daty ${slot.start.toLocaleString()}!`);
              }

              await tx.appointment.create({
                  data: {
                    tenantId: user.tenantId,
                    patientId: data.patientId,
                    startDateTime: slot.start,
                    endDateTime: slot.end,
                    status: 'SCHEDULED',
                    type: data.type,
                    price: data.price,
                    recurrenceId: recurrenceId
                  }
              });
          }
      });

      revalidatePath('/dashboard/calendar');
      return { success: true, count: appointmentsToCreate.length };
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateAppointment(id: string, data: Partial<CreateAppointmentData> & { status?: string, isPaid?: boolean }) {
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
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                type: data.type,
                price: data.price,
                status: data.status,
                isPaid: data.isPaid
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
