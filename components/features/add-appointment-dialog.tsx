"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointment } from "@/app/actions/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { Patient } from "@prisma/client";

interface AddAppointmentDialogProps {
    patients: Patient[]; // Passed from server
}

export function AddAppointmentDialog({ patients }: AddAppointmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        patientId: "",
        date: "",
        time: "",
        duration: "60", // minutes
        type: "TERAPIA",
        price: "150",
        isRecurring: false,
        recurrenceCount: "4"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.patientId || !formData.date || !formData.time) {
            setError("Wypełnij wszystkie wymagane pola.");
            return;
        }

        const startDateTime = new Date(`${formData.date}T${formData.time}`);
        const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000);

        startTransition(async () => {
            const result = await createAppointment({
                patientId: formData.patientId,
                startDateTime,
                endDateTime,
                type: formData.type,
                price: parseFloat(formData.price),
                recurrence: formData.isRecurring ? {
                    frequency: "WEEKLY",
                    count: parseInt(formData.recurrenceCount)
                } : undefined
            });

            if (result.success) {
                setOpen(false);
                setFormData({ ...formData, date: "", time: "", isRecurring: false });
            } else {
                setError(result.error || "Błąd");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Nowa Wizyta</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Umów wizytę</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div role="alert" className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <Label>Pacjent</Label>
                        <Select onValueChange={(v) => setFormData({...formData, patientId: v})} value={formData.patientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wybierz pacjenta" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.lastName} {p.firstName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label>Godzina</Label>
                            <Input
                                type="time"
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Czas trwania (min)</Label>
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={e => setFormData({...formData, duration: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label>Cena (PLN)</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div>
                         <Label>Typ wizyty</Label>
                         <Select onValueChange={(v) => setFormData({...formData, type: v})} value={formData.type}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KONSULTACJA">Konsultacja</SelectItem>
                                <SelectItem value="TERAPIA">Terapia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded bg-slate-50">
                        <input
                            type="checkbox"
                            id="recurrence"
                            checked={formData.isRecurring}
                            onChange={e => setFormData({...formData, isRecurring: e.target.checked})}
                            className="h-4 w-4"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="recurrence"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Wizyta cykliczna (co tydzień)
                            </label>
                            {formData.isRecurring && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs">Liczba wizyt:</span>
                                    <Input
                                        type="number"
                                        className="h-7 w-20 text-xs"
                                        value={formData.recurrenceCount}
                                        onChange={e => setFormData({...formData, recurrenceCount: e.target.value})}
                                        min={2} max={12}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Zapisywanie..." : "Zapisz wizytę"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
