import { DietMealType } from "@/types/diet";

export const DIET_MEAL_COLORS: Record<
  DietMealType,
  { label: string; color: string; bg: string }
> = {
  food: {
    label: "사료",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  snack: {
    label: "간식",
    color: "#EA580C",
    bg: "#FFEDD5",
  },
};
