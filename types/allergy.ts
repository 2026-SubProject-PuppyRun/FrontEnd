export type AllergySeverity = "mild" | "moderate" | "severe";

export interface AllergyRecord {
  id: string;
  petId: string;
  allergen: string;
  severity?: AllergySeverity;
  symptoms?: string;
  diagnosedAt?: string | null;
  isActive: boolean;
  memo?: string;
}

export type AllergyFormValues = Pick<
  AllergyRecord,
  | "allergen"
  | "severity"
  | "symptoms"
  | "diagnosedAt"
  | "isActive"
  | "memo"
>;
