import { WeightChartPoint, WeightPeriod, WeightRecord } from "@/types/weight";
import dayjs from "dayjs";

const PERIOD_MONTHS: Record<WeightPeriod, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "1y": 12,
};

export const filterRecordsByPeriod = (
  records: WeightRecord[],
  period: WeightPeriod,
): WeightRecord[] => {
  const startDate = dayjs().subtract(PERIOD_MONTHS[period], "month");
  return records.filter((record) =>
    dayjs(record.measuredAt).isAfter(startDate.subtract(1, "day")),
  );
};

export const buildWeightChartData = (
  records: WeightRecord[],
): WeightChartPoint[] =>
  [...records]
    .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt))
    .map((record) => ({
      recordId: record.id,
      label: dayjs(record.measuredAt).format("M/D"),
      value: record.weight,
      measuredAt: record.measuredAt,
    }));
