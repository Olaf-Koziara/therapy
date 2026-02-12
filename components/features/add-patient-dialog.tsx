"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatient } from "@/app/actions/patients";
import { Loader2, Plus } from "lucide-react";

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
                            <Label htmlFor="firstName">Imię</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Nazwisko</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                         <Label htmlFor="email">Email (opcjonalnie)</Label>
                         <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="pesel">PESEL</Label>
                            <Input
                                id="pesel"
                                name="pesel"
                                value={formData.pesel}
                                onChange={e => setFormData({...formData, pesel: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="birthDate">Data Urodzenia</Label>
                            <Input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                         <Label htmlFor="guardianName">Imię opiekuna (dla dzieci)</Label>
                         <Input
                            id="guardianName"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={e => setFormData({...formData, guardianName: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded bg-slate-50">
                        <input
                            type="checkbox"
                            id="gdpr"
                            name="gdpr"
                            checked={formData.gdprConsent}
                            onChange={e => setFormData({...formData, gdprConsent: e.target.checked})}
                            className="h-4 w-4"
                            required
                        />
                         <Label htmlFor="gdpr" className="text-sm font-normal cursor-pointer">
                            Potwierdzam odebranie zgody RODO (z dzisiejszą datą)
                        </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Zapisywanie...
                            </>
                        ) : (
                            "Zapisz"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
