"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PatientForm } from "./patient-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Dodaj Pacjenta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowego pacjenta</DialogTitle>
          <DialogDescription>
            Wprowadź dane pacjenta. Kliknij zapisz, aby dodać.
          </DialogDescription>
        </DialogHeader>
        <PatientForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
