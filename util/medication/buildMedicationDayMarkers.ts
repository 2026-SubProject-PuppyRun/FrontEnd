import { MedicationDayMarker, MedicationRecord } from "@/types/medication";

export const buildMedicationDayMarkers = (
  records: MedicationRecord[],
): Record<string, MedicationDayMarker> => {
  const markers: Record<string, MedicationDayMarker> = {};

  records.forEach((record) => {
    const current = markers[record.date] ?? { count: 0 };
    current.count += 1;
    markers[record.date] = current;
  });

  return markers;
};
