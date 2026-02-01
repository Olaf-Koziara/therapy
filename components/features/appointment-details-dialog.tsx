"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAppointment, updateAppointment } from "@/app/actions/calendar";
import { format } from "date-fns";

type Appointment = {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    patient: {
        firstName: string;
        lastName: string;
    };
    type: string;
    price: any; // Decimal from Prisma
};

interface AppointmentDetailsDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Edit state
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("60");

    if (!appointment) return null;

    const handleEditClick = () => {
        setStartTime(format(new Date(appointment.startDateTime), "HH:mm"));
        const diff = (new Date(appointment.endDateTime).getTime() - new Date(appointment.startDateTime).getTime()) / 60000;
        setDuration(diff.toString());
        setIsEditing(true);
    };

    const handleSave = () => {
        const dateStr = format(new Date(appointment.startDateTime), "yyyy-MM-dd");
        const start = new Date(`${dateStr}T${startTime}`);
        const end = new Date(start.getTime() + parseInt(duration) * 60000);

        startTransition(async () => {
            const res = await updateAppointment(appointment.id, {
                startDateTime: start,
                endDateTime: end
            });
            if (res.success) {
                setIsEditing(false);
                onOpenChange(false);
            } else {
                alert(res.error);
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Czy na pewno chcesz usunąć tę wizytę?")) return;
        startTransition(async () => {
            await deleteAppointment(appointment.id);
            onOpenChange(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) setIsEditing(false);
            onOpenChange(v);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edytuj wizytę" : "Szczegóły wizyty"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Pacjent</Label>
                        <div className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</div>
                    </div>

                    {isEditing ? (
                        <>
                             <div>
                                <Label>Godzina</Label>
                                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                            </div>
                            <div>
                                <Label>Czas trwania (min)</Label>
                                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Label>Termin</Label>
                                <div>{format(new Date(appointment.startDateTime), "yyyy-MM-dd HH:mm")} - {format(new Date(appointment.endDateTime), "HH:mm")}</div>
                            </div>
                             <div>
                                <Label>Typ</Label>
                                <div>{appointment.type}</div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
                            <Button onClick={handleSave} disabled={isPending}>Zapisz</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>Usuń</Button>
                            <Button onClick={handleEditClick}>Edytuj</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
