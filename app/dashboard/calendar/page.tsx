import { getAppointments } from "@/app/actions/calendar";
import { getPatients } from "@/app/actions/patients";
import { WeekView } from "@/components/features/calendar-week-view";
import { AddAppointmentDialog } from "@/components/features/add-appointment-dialog";
import { startOfWeek, endOfWeek } from "date-fns";
import { pl } from "date-fns/locale";

export default async function CalendarPage() {
  const now = new Date();
  const start = startOfWeek(now, { locale: pl, weekStartsOn: 1 });
  const end = endOfWeek(now, { locale: pl, weekStartsOn: 1 });

  const appointments = await getAppointments(start, end);
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kalendarz</h1>
        <AddAppointmentDialog patients={patients} />
      </div>

      <WeekView date={now} appointments={appointments} />
    </div>
  );
}
