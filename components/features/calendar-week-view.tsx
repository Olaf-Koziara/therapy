import { startOfWeek, endOfWeek, eachDayOfInterval, format, addDays, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Appointment = {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    patient: {
        firstName: string;
        lastName: string;
    };
    type: string;
};

interface WeekViewProps {
    date: Date;
    appointments: Appointment[];
}

export function WeekView({ date, appointments }: WeekViewProps) {
    const start = startOfWeek(date, { locale: pl, weekStartsOn: 1 });
    const end = endOfWeek(date, { locale: pl, weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    // Generate time slots (8:00 - 20:00)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
        <div className="border rounded-md overflow-hidden bg-white shadow-sm">
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
                                        <div
                                            key={app.id}
                                            className="bg-blue-100 text-blue-700 text-xs p-1 rounded mb-1 border-l-2 border-blue-500 truncate cursor-pointer hover:bg-blue-200"
                                            title={`${format(app.startDateTime, 'HH:mm')} - ${app.patient.lastName}`}
                                        >
                                            <div className="font-bold">{format(app.startDateTime, 'HH:mm')}</div>
                                            <div>{app.patient.lastName}</div>
                                        </div>
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
