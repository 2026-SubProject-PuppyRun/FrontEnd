import { AllergyRecord } from "@/types/allergy";
import {
  formatAllergyDate,
  getCategoryLabel,
  getSeverityLabel,
} from "@/util/allergyLabels";

const formatRecordLine = (record: AllergyRecord): string => {
  const parts = [
    `[${getCategoryLabel(record.category)}] ${record.allergen}`,
    record.severity ? getSeverityLabel(record.severity) : null,
    record.symptoms ?? null,
    record.diagnosedAt ? formatAllergyDate(record.diagnosedAt) : null,
  ].filter(Boolean);

  return `• ${parts.join(" · ")}`;
};

export const formatAllergyShareMessage = (
  petName: string,
  records: AllergyRecord[],
): string | null => {
  const activeRecords = records.filter((r) => r.isActive);
  if (activeRecords.length === 0) {
    return null;
  }

  const lines = activeRecords.map(formatRecordLine);
  return [`[${petName}] 알러지 기록`, "", ...lines].join("\n");
};
