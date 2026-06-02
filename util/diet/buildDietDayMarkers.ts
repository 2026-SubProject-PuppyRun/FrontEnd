import { DietDayMarker, DietRecord } from "@/types/diet";

export const buildDietDayMarkers = (
  records: DietRecord[],
): Record<string, DietDayMarker> => {
  const markers: Record<string, DietDayMarker> = {};

  records.forEach((record) => {
    const current = markers[record.date] ?? {
      hasFood: false,
      hasSnack: false,
      foodAmount: 0,
      snackAmount: 0,
    };

    if (record.type === "food") {
      current.hasFood = true;
      current.foodAmount += record.amount;
    } else {
      current.hasSnack = true;
      current.snackAmount += record.amount;
    }

    markers[record.date] = current;
  });

  return markers;
};
