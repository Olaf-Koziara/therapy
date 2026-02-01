"use server"

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AvailabilityInput = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export async function getAvailability() {
    const user = await getCurrentUser();
    return db.availability.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { dayOfWeek: 'asc' }
    });
}

export async function saveAvailability(items: AvailabilityInput[]) {
    const user = await getCurrentUser();

    // Transaction: Delete all old, create new
    try {
        await db.$transaction([
            db.availability.deleteMany({
                where: { tenantId: user.tenantId }
            }),
            db.availability.createMany({
                data: items.map(item => ({
                    tenantId: user.tenantId,
                    dayOfWeek: item.dayOfWeek,
                    startTime: item.startTime,
                    endTime: item.endTime
                }))
            })
        ]);
        revalidatePath('/dashboard/settings/availability');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Błąd zapisu dostępności" };
    }
}
