"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatient } from "@/app/actions/patients";
import { Plus } from "lucide-react";

export function AddPatientDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        guardianName: "",
        pesel: "",
        birthDate: "",
        gdprConsent: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createPatient({
                ...formData,
                email: formData.email || undefined,
                guardianName: formData.guardianName || undefined,
                pesel: formData.pesel || undefined,
                birthDate: formData.birthDate || undefined
            });

            if (result.success) {
                setOpen(false);
                setFormData({ firstName: "", lastName: "", phone: "", email: "", guardianName: "", pesel: "", birthDate: "", gdprConsent: false });
            } else {
                setError(result.error || "Błąd podczas dodawania pacjenta");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Dodaj Pacjenta</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nowy Pacjent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="patient-firstName">Imię <span className="text-red-500 ml-1">*</span></Label>
                            <Input id="patient-firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                        </div>
                        <div>
                            <Label htmlFor="patient-lastName">Nazwisko <span className="text-red-500 ml-1">*</span></Label>
                            <Input id="patient-lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="patient-phone">Telefon <span className="text-red-500 ml-1">*</span></Label>
                        <Input id="patient-phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>

                    <div>
                         <Label htmlFor="patient-email">Email (opcjonalnie)</Label>
                         <Input id="patient-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="patient-pesel">PESEL</Label>
                            <Input id="patient-pesel" value={formData.pesel} onChange={e => setFormData({...formData, pesel: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="patient-birthDate">Data Urodzenia</Label>
                            <Input id="patient-birthDate" type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                        </div>
                    </div>

                    <div>
                         <Label htmlFor="patient-guardianName">Imię opiekuna (dla dzieci)</Label>
                         <Input id="patient-guardianName" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} />
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded bg-slate-50">
                        <input
                            type="checkbox"
                            id="patient-gdpr"
                            checked={formData.gdprConsent}
                            onChange={e => setFormData({...formData, gdprConsent: e.target.checked})}
                            className="h-4 w-4"
                            required
                        />
                         <Label htmlFor="patient-gdpr" className="text-sm font-normal">
                            Potwierdzam odebranie zgody RODO (z dzisiejszą datą) <span className="text-red-500 ml-1">*</span>
                        </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Zapisywanie..." : "Zapisz"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
