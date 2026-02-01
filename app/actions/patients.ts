'use server'

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { patientSchema, PatientFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getPatients() {
  const user = await getCurrentUser();

  return db.patient.findMany({
    where: {
      tenantId: user.tenantId
    },
    orderBy: {
      lastName: 'asc'
    }
  });
}

export async function createPatient(data: PatientFormValues) {
  const user = await getCurrentUser();

  const validated = patientSchema.safeParse(data);

  if (!validated.success) {
    throw new Error("Invalid data");
  }

  try {
    const patient = await db.patient.create({
      data: {
        ...validated.data,
        tenantId: user.tenantId,
      },
    });

    revalidatePath('/dashboard/patients');
    return { success: true, patient };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create patient" };
  }
}

export async function getPatientById(id: string) {
    const user = await getCurrentUser();
    return db.patient.findFirst({
        where: {
            id,
            tenantId: user.tenantId
        }
    })
}
