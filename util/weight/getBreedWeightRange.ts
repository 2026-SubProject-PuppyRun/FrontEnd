import { BREED_DATA } from "@/constants/breedData";

export const parseWeightRange = (
  range: string,
): { min: number; max: number } | null => {
  const match = range.match(/([\d.]+)\s*~\s*([\d.]+)/);
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2]);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
};

export const getBreedWeightRangeLabel = (
  breedCode: string | undefined,
): string | null => {
  if (!breedCode) return null;
  const breed = BREED_DATA.find((item) => item.code === breedCode);
  return breed?.weightRange ?? null;
};

export const getWeightStatus = (
  weight: number,
  rangeLabel: string | null,
): { label: string; color: string } => {
  if (!rangeLabel) {
    return { label: "기록 있음", color: "#6B7280" };
  }

  const parsed = parseWeightRange(rangeLabel);
  if (!parsed) {
    return { label: "기록 있음", color: "#6B7280" };
  }

  if (weight < parsed.min) {
    return { label: "저체중", color: "#2563EB" };
  }
  if (weight > parsed.max) {
    return { label: "과체중", color: "#DC2626" };
  }
  return { label: "정상", color: "#16A34A" };
};
