import type { TrackingProgress } from "@/util/api/pets";

export const WALK_GRADE_BY_CODE = {
  "000": { level: 1, name: "비기너", label: "BEGINNER" },
  "001": { level: 2, name: "익스플로러", label: "EXPLORER" },
  "002": { level: 3, name: "러너", label: "RUNNER" },
  "003": { level: 4, name: "마라토너", label: "MARATHONER" },
  "004": { level: 5, name: "레전드", label: "LEGEND" },
} as const;

export type WalkGradeCode = keyof typeof WALK_GRADE_BY_CODE;

export const WALK_GRADE_CODES = Object.keys(
  WALK_GRADE_BY_CODE,
) as WalkGradeCode[];

export const MAX_WALK_GRADE_LEVEL = WALK_GRADE_CODES.length;

export type WalkGradeInfo = {
  code: WalkGradeCode;
  name: string;
  label: string;
  level: number;
  nextLevel: number;
  progressPercent: number;
  remainingPercent: number;
};

const getGradeFromCode = (code: string) => {
  const normalized = code.padStart(3, "0") as WalkGradeCode;
  return (
    WALK_GRADE_BY_CODE[normalized] ?? WALK_GRADE_BY_CODE["000"]
  );
};

/** 현재 배지 구간 내 다음 배지까지 진행률 */
export const calcWalkProgressPercent = (progress: TrackingProgress) => {
  const { walkedDistance, requiredDistance, nextRequiredDistance } = progress;

  if (walkedDistance < requiredDistance) {
    if (requiredDistance <= 0) return 0;
    return Math.min(
      100,
      Math.round((walkedDistance / requiredDistance) * 100),
    );
  }

  const range = nextRequiredDistance - requiredDistance;
  if (range <= 0) return 100;

  const walkedInTier = walkedDistance - requiredDistance;
  return Math.min(100, Math.round((walkedInTier / range) * 100));
};

export const getWalkGradeInfo = (
  progress: TrackingProgress,
): WalkGradeInfo => {
  const grade = getGradeFromCode(progress.code);
  const progressPercent = calcWalkProgressPercent(progress);
  const nextLevel = Math.min(grade.level + 1, MAX_WALK_GRADE_LEVEL);

  return {
    code: progress.code.padStart(3, "0") as WalkGradeCode,
    name: grade.name,
    label: grade.label,
    level: grade.level,
    nextLevel,
    progressPercent,
    remainingPercent: 100 - progressPercent,
  };
};
