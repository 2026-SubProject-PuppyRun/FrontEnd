import type { MedicationDoseUnit } from "@/constants/medicationDoseUnits";
import type { CalendarDayCell } from "@/types/diet";

export type { CalendarDayCell };

export interface MedicationRecord {
  id: string;
  petId: string;
  date: string;
  time: string;
  name: string;
  doseAmount: number;
  doseUnit: MedicationDoseUnit | string;
  memo?: string;
  administeredAt: string;
}

export type MedicationFormValues = {
  name: string;
  doseAmount: number;
  doseUnit: MedicationDoseUnit;
  date: string;
  time: string;
  memo?: string;
};

export interface MedicationDayMarker {
  count: number;
}
