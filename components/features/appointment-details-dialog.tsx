"use client"

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAppointment, updateAppointment } from "@/app/actions/calendar";
import { format } from "date-fns";
import { NoteEditor } from "@/components/features/note-editor";

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
    price: any;
    note?: {
        id: string;
        content: string;
    } | null;
};

interface AppointmentDetailsDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Edit state
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("60");

    useEffect(() => {
        if (open) {
            setIsEditing(false);
            setIsEditingNote(false);
        }
    }, [open]);

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
            if (!v) {
                setIsEditing(false);
                setIsEditingNote(false);
            }
            onOpenChange(v);
        }}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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

                    <div className="h-px bg-slate-200 my-4" />

                    <div>
                        <h3 className="font-medium mb-2 text-sm text-slate-900">Notatka wizyty</h3>
                        {appointment.note && !isEditingNote ? (
                             <div className="bg-slate-50 p-3 rounded text-sm relative group border">
                                <p className="whitespace-pre-wrap">{appointment.note.content}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 text-xs"
                                    onClick={() => setIsEditingNote(true)}
                                >
                                    Edytuj
                                </Button>
                            </div>
                        ) : (
                            <NoteEditor
                                noteId={appointment.note?.id}
                                initialContent={appointment.note?.content}
                                patientId={appointment.patient.id}
                                appointmentId={appointment.id}
                                placeholder="Dodaj notatkę do tej wizyty..."
                                onSaved={() => {
                                    onOpenChange(false); // Close dialog to refresh data
                                }}
                             />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
                            <Button onClick={handleSave} disabled={isPending}>Zapisz</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>Usuń wizytę</Button>
                            <Button onClick={handleEditClick}>Edytuj wizytę</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
