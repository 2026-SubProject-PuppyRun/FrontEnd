import { AllergySeverity } from "@/types/allergy";

const SEVERITY_LABELS: Record<AllergySeverity, string> = {
  mild: "경미",
  moderate: "보통",
  severe: "심각",
};

export const ALLERGY_SEVERITIES: AllergySeverity[] = [
  "mild",
  "moderate",
  "severe",
];

export const ALLERGY_SEVERITY_COLORS: Record<
  AllergySeverity,
  { color: string; bg: string }
> = {
  mild: { color: "#2563EB", bg: "#EFF6FF" },
  moderate: { color: "#D97706", bg: "#FEF3C7" },
  severe: { color: "#F25857", bg: "#FEE2E2" },
};

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
