import { AllergyRecord } from "@/types/allergy";

export const buildActiveAllergySummary = (records: AllergyRecord[]): string => {
  const active = records.filter((r) => r.isActive);
  if (active.length === 0) return "";

  return active.map((r) => r.allergen).join(" · ");
};
