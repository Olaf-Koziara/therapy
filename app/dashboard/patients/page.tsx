import { getPatients } from "@/app/actions/patients";
import { AddPatientDialog } from "@/components/features/add-patient-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pacjenci</h1>
        <AddPatientDialog />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nazwisko i Imię</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        Brak pacjentów. Dodaj pierwszego!
                    </TableCell>
                </TableRow>
            ) : (
                patients.map((patient: any) => (
                <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                        {patient.lastName} {patient.firstName}
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email || "-"}</TableCell>
                    <TableCell>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                            <Button variant="ghost" size="sm">Szczegóły</Button>
                        </Link>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
