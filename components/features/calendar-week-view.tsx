"use client"

import { useState } from "react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addDays, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

type Appointment = {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
    };
    type: string;
    status: string;
    isPaid: boolean;
    price: any;
    note?: {
        id: string;
        content: string;
    } | null;
};

interface WeekViewProps {
    date: Date;
    appointments: Appointment[];
}

export function WeekView({ date, appointments: rawAppointments }: WeekViewProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Ensure dates are Date objects (handling serialization)
    const appointments = rawAppointments.map(app => ({
        ...app,
        startDateTime: new Date(app.startDateTime),
        endDateTime: new Date(app.endDateTime)
    }));

    const start = startOfWeek(date, { locale: pl, weekStartsOn: 1 });
    const end = endOfWeek(date, { locale: pl, weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    // Generate time slots (8:00 - 20:00)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
        <div className="border rounded-md overflow-hidden bg-white shadow-sm">
            <AppointmentDetailsDialog
                appointment={selectedAppointment}
                open={!!selectedAppointment}
                onOpenChange={(open) => !open && setSelectedAppointment(null)}
            />
            {/* Header: Days */}
            <div className="grid grid-cols-8 border-b bg-slate-50">
                <div className="p-4 border-r text-center font-medium text-slate-500">Godz</div>
                {days.map(day => (
                    <div key={day.toISOString()} className="p-4 text-center border-r last:border-r-0">
                        <div className="font-semibold text-slate-900">{format(day, 'EEEE', { locale: pl })}</div>
                        <div className="text-sm text-slate-500">{format(day, 'd MMM', { locale: pl })}</div>
                    </div>
                ))}
            </div>

            {/* Grid: Hours x Days */}
            <div className="divide-y">
                {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-8 min-h-[60px]">
                        {/* Time Column */}
                        <div className="p-2 border-r text-center text-sm text-slate-500 flex items-start justify-center pt-2">
                            {hour}:00
                        </div>

                        {/* Day Columns */}
                        {days.map(day => {
                            // Find appointments for this day and overlapping this hour slot
                            // Note: This is a simplified view logic. A real calendar needs absolute positioning for exact times.
                            // For MVP, we just list them in the slot if they start in this hour.
                            const dayApps = appointments.filter(app =>
                                isSameDay(app.startDateTime, day) &&
                                app.startDateTime.getHours() === hour
                            );

                            return (
                                <div key={day.toISOString()} className="border-r last:border-r-0 p-1 relative">
                                    {dayApps.map(app => (
                                        <button
                                            key={app.id}
                                            type="button"
                                            onClick={() => setSelectedAppointment(app)}
                                            className={cn(
                                                "text-xs p-1 rounded mb-1 border-l-4 truncate hover:opacity-80 transition-opacity w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                app.status === 'COMPLETED' ? "bg-green-100 text-green-800 border-green-500" :
                                                app.status === 'CANCELLED' ? "bg-red-100 text-red-800 border-red-500 opacity-60" :
                                                app.status === 'NO_SHOW' ? "bg-gray-200 text-gray-600 border-gray-500" :
                                                "bg-blue-100 text-blue-700 border-blue-500"
                                            )}
                                            title={`${format(app.startDateTime, 'HH:mm')} - ${app.patient.lastName}`}
                                        >
                                            <div className="font-bold flex justify-between">
                                                <span>{format(app.startDateTime, 'HH:mm')}</span>
                                                {app.isPaid && <span className="text-[10px] text-green-700 font-extrabold">$</span>}
                                            </div>
                                            <div>{app.patient.lastName}</div>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
