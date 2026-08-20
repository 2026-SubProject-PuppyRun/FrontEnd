export interface WeightRecord {
  id: string;
  petId: string;
  weight: number;
  measuredAt: string;
}

export type WeightFormValues = Pick<WeightRecord, "weight">;

export type WeightPeriod = "1m" | "3m" | "6m" | "1y";

export interface WeightSummary {
  currentWeight: number | null;
  previousDelta: number | null;
  statusLabel: string;
  statusColor: string;
  breedRangeLabel: string | null;
}

export interface WeightChartPoint {
  recordId: string;
  label: string;
  value: number;
  measuredAt: string;
}
