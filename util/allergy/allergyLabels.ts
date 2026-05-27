import {
  AllergyCategory,
  AllergySeverity,
} from "@/types/allergy";

const CATEGORY_LABELS: Record<AllergyCategory, string> = {
  food: "음식",
  environment: "환경",
  medication: "약물",
  other: "기타",
};

const SEVERITY_LABELS: Record<AllergySeverity, string> = {
  mild: "경미",
  moderate: "보통",
  severe: "심각",
};

export const ALLERGY_CATEGORIES: AllergyCategory[] = [
  "food",
  "environment",
  "medication",
  "other",
];

export const ALLERGY_SEVERITIES: AllergySeverity[] = [
  "mild",
  "moderate",
  "severe",
];

export const getCategoryLabel = (category: AllergyCategory): string =>
  CATEGORY_LABELS[category];

export const getSeverityLabel = (severity: AllergySeverity): string =>
  SEVERITY_LABELS[severity];

export const formatAllergyDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};
