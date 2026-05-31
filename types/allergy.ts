export type AllergyCategory = "food" | "environment" | "medication" | "other";

export type AllergySeverity = "mild" | "moderate" | "severe";

export interface AllergyRecord {
  id: string;
  petId: string;
  category: AllergyCategory;
  allergen: string;
  severity?: AllergySeverity;
  symptoms?: string;
  diagnosedAt?: string | null;
  isActive: boolean;
}

export type AllergyFormValues = Pick<
  AllergyRecord,
  "category" | "allergen" | "severity" | "symptoms" | "diagnosedAt" | "isActive"
>;
