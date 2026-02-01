import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  phone: z.string().min(9, "Numer telefonu jest za krótki"),
  email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
  guardianName: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
