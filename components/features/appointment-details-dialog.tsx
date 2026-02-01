"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { deleteAppointment, updateAppointment } from "@/app/actions/calendar";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Appointment = {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    patient: {
        firstName: string;
        lastName: string;
    };
    type: string;
    price: number; // Decimal in DB, but treated as number in JS often (or string/object depending on Prisma)
};

interface AppointmentDetailsDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onClose: () => void;
}

export function AppointmentDetailsDialog({ appointment, open, onClose }: AppointmentDetailsDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{ date: string, time: string, duration: string }>({ date: "", time: "", duration: "" });

    if (!appointment) return null;

    // Reset edit state when opening
    if (open && !isEditing && !editData.date && appointment) {
       // We don't want to reset if we are already editing.
       // Ideally use useEffect or a wrapper.
       // For KISS, let's just initialize when entering edit mode.
    }

    const handleDelete = () => {
        if (!confirm("Czy na pewno chcesz usunąć wizytę?")) return;

        startTransition(async () => {
            const res = await deleteAppointment(appointment.id);
            if (res.success) {
                onClose();
            } else {
                alert(res.error);
            }
        });
    };

    const startEdit = () => {
        setEditData({
            date: format(appointment.startDateTime, 'yyyy-MM-dd'),
            time: format(appointment.startDateTime, 'HH:mm'),
            duration: String((appointment.endDateTime.getTime() - appointment.startDateTime.getTime()) / 60000)
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        const startDateTime = new Date(`${editData.date}T${editData.time}`);
        const endDateTime = new Date(startDateTime.getTime() + parseInt(editData.duration) * 60000);

        startTransition(async () => {
            const res = await updateAppointment(appointment.id, {
                startDateTime,
                endDateTime
            });
            if (res.success) {
                setIsEditing(false);
                onClose();
            } else {
                alert(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edytuj wizytę" : "Szczegóły wizyty"}</DialogTitle>
                </DialogHeader>

                {isEditing ? (
                    <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Data</Label>
                                <Input
                                    type="date"
                                    value={editData.date}
                                    onChange={e => setEditData({...editData, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Godzina</Label>
                                <Input
                                    type="time"
                                    value={editData.time}
                                    onChange={e => setEditData({...editData, time: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Czas trwania (min)</Label>
                            <Input
                                type="number"
                                value={editData.duration}
                                onChange={e => setEditData({...editData, duration: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
                            <Button onClick={handleSave} disabled={isPending}>Zapisz</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-semibold text-slate-500">Pacjent:</div>
                            <div>{appointment.patient.lastName} {appointment.patient.firstName}</div>

                            <div className="font-semibold text-slate-500">Data:</div>
                            <div>{format(appointment.startDateTime, 'dd MMMM yyyy', { locale: pl })}</div>

                            <div className="font-semibold text-slate-500">Godzina:</div>
                            <div>{format(appointment.startDateTime, 'HH:mm')} - {format(appointment.endDateTime, 'HH:mm')}</div>

                            <div className="font-semibold text-slate-500">Typ:</div>
                            <div>{appointment.type}</div>

                            <div className="font-semibold text-slate-500">Cena:</div>
                            <div>{Number(appointment.price).toFixed(2)} PLN</div>
                        </div>

                        <div className="flex gap-2 justify-end mt-6">
                            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>Usuń</Button>
                            <Button variant="outline" onClick={startEdit}>Edytuj</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
