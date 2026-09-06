import { WeightRecord, WeightSummary } from "@/types/weight";
import { getBreedWeightRangeLabel, getWeightStatus } from "./getBreedWeightRange";

export const buildWeightSummary = (
  records: WeightRecord[],
  breedCode: string | undefined,
): WeightSummary => {
  const breedRangeLabel = getBreedWeightRangeLabel(breedCode);

  if (records.length === 0) {
    return {
      currentWeight: null,
      previousDelta: null,
      statusLabel: "기록 없음",
      statusColor: "#9CA3AF",
      breedRangeLabel,
    };
  }

  const sorted = [...records].sort((a, b) =>
    b.measuredAt.localeCompare(a.measuredAt),
  );
  const latest = sorted[0];
  const previous = sorted[1];
  const status = getWeightStatus(latest.weight, breedRangeLabel);

  return {
    currentWeight: latest.weight,
    previousDelta:
      previous != null ? Number((latest.weight - previous.weight).toFixed(1)) : null,
    statusLabel: status.label,
    statusColor: status.color,
    breedRangeLabel,
  };
};
