import { getPatientById } from "@/app/actions/patients";
import { getPatientNotes } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteList } from "@/components/features/note-list";
import { NoteEditor } from "@/components/features/note-editor";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const notes = await getPatientNotes(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patients">
            <Button variant="outline">← Powrót</Button>
        </Link>
        <h1 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Dane kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-semibold">Telefon:</span>
                    <span>{patient.phone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{patient.email || "-"}</span>
                </div>
                {patient.guardianName && (
                     <div className="flex justify-between">
                        <span className="font-semibold">Opiekun:</span>
                        <span>{patient.guardianName}</span>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Historia</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">Brak wizyt w historii.</p>
                {/* TODO: Add Appointment History */}
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Dokumentacja Medyczna (Szyfrowana)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Nowa notatka</h3>
                <NoteEditor patientId={id} />
             </div>

             <div className="space-y-4">
                <h3 className="text-lg font-medium">Historia notatek</h3>
                <NoteList notes={notes} />
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
