export interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  vaccinatedAt: string;
  nextVaccinationAt: string;
  memo?: string;
}

export type VaccineFormValues = Pick<
  VaccineRecord,
  "name" | "vaccinatedAt" | "nextVaccinationAt" | "memo"
>;
