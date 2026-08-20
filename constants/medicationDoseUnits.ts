export const MEDICATION_DOSE_UNITS = [
  "tablet",
  "capsule",
  "ml",
  "mg",
  "g",
  "drop",
  "pump",
  "pack",
] as const;

export type MedicationDoseUnit = (typeof MEDICATION_DOSE_UNITS)[number];

export const MEDICATION_DOSE_UNIT_LABELS: Record<MedicationDoseUnit, string> = {
  tablet: "정",
  capsule: "캡슐",
  ml: "ml",
  mg: "mg",
  g: "g",
  drop: "방울",
  pump: "펌프",
  pack: "포",
};

export const isMedicationDoseUnit = (
  value: string,
): value is MedicationDoseUnit =>
  MEDICATION_DOSE_UNITS.includes(value as MedicationDoseUnit);

export const getMedicationDoseUnitLabel = (unit: string) =>
  isMedicationDoseUnit(unit) ? MEDICATION_DOSE_UNIT_LABELS[unit] : unit;

export const formatMedicationDose = (amount: number, unit: string) => {
  const label = getMedicationDoseUnitLabel(unit);
  const amountStr = Number.isInteger(amount) ? String(amount) : String(amount);
  if (unit === "ml" || unit === "mg" || unit === "g") {
    return `${amountStr} ${label}`;
  }
  return `${amountStr}${label}`;
};
