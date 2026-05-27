import { AllergyRecord } from "@/types/allergy";
import { getCategoryLabel } from "@/util/allergyLabels";

export const buildActiveAllergySummary = (
  records: AllergyRecord[],
): string => {
  const active = records.filter((r) => r.isActive);
  const counts = active.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<AllergyRecord["category"], number>>,
  );

  return Object.entries(counts)
    .map(([cat, n]) => `${getCategoryLabel(cat as AllergyRecord["category"])} ${n}`)
    .join(" · ");
};
