import { formatTime } from "@/util/run/formatTime";

type RunDataLike = {
  distance?: number;
  totalTime?: number;
  pace?: string;
  averagePace?: string;
} | null | undefined;

export type RunResultStats = {
  distanceKm: string;
  totalTimeLabel: string;
  paceLabel: string;
};

export const getRunResultStats = (runData: RunDataLike): RunResultStats => ({
  distanceKm: ((runData?.distance ?? 0) / 1000).toFixed(2),
  totalTimeLabel: formatTime(runData?.totalTime ?? 0),
  paceLabel: runData?.averagePace || runData?.pace || "0'00''",
});
