export interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  vaccinatedAt: string;
  nextVaccinationAt: string;
}

export type VaccineFormValues = Pick<
  VaccineRecord,
  "name" | "vaccinatedAt" | "nextVaccinationAt"
>;
