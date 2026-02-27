import { getPatientById } from "@/app/actions/patients";
import { getPatientNotes } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteList } from "@/components/features/note-list";
import { NoteEditor } from "@/components/features/note-editor";
import { format } from "date-fns";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const notes = await getPatientNotes(id);

  // Calculate Wallet
  const totalDue = patient.appointments
    .filter((app: any) => app.status === 'COMPLETED' && !app.isPaid)
    .reduce((sum: number, app: any) => sum + Number(app.price), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between">
         <div className="flex items-center gap-4">
            <Link href="/dashboard/patients">
                <Button variant="outline">← Powrót</Button>
            </Link>
            <div>
                 <h1 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h1>
                 <div className="text-sm text-muted-foreground flex gap-2">
                    {patient.pesel && <span>PESEL: {patient.pesel}</span>}
                    {patient.birthDate && <span>Ur. {format(patient.birthDate, 'yyyy-MM-dd')}</span>}
                 </div>
            </div>
         </div>
         <Card className="bg-slate-50 border-blue-200">
            <CardContent className="p-4 flex flex-col items-center">
                <span className="text-sm text-slate-500 font-medium uppercase">Do zapłaty</span>
                <span className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {totalDue.toFixed(2)} PLN
                </span>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dane kontaktowe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold">Telefon:</span>
                        <span>{patient.phone}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold">Email:</span>
                        <span>{patient.email || "-"}</span>
                    </div>
                    {patient.guardianName && (
                        <div className="flex justify-between border-b py-2">
                            <span className="font-semibold">Opiekun:</span>
                            <span>{patient.guardianName}</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-2">
                         <span className="font-semibold">Zgoda RODO:</span>
                         <span className={patient.gdprConsent ? "text-green-600" : "text-red-500"}>
                            {patient.gdprConsent ? "Tak" : "Nie"}
                         </span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historia Wizyt</CardTitle>
                </CardHeader>
                <CardContent>
                    {patient.appointments.length === 0 ? (
                         <p className="text-muted-foreground text-sm">Brak wizyt w historii.</p>
                    ) : (
                        <div className="space-y-2">
                            {patient.appointments.map((app: any) => (
                                <div key={app.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                    <div>
                                        <div className="font-medium">{format(app.startDateTime, "yyyy-MM-dd HH:mm")}</div>
                                        <div className="text-xs text-muted-foreground">{app.type}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={app.isPaid ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                            {Number(app.price).toFixed(2)} PLN
                                        </div>
                                        <div className="text-xs">{app.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
    </div>
  );
}
