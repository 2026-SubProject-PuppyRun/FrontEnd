export type DietMealType = "food" | "snack";

export interface DietRecord {
  id: string;
  petId: string;
  date: string;
  type: DietMealType;
  amount: number;
  memo?: string;
}

export type DietFormValues = Pick<
  DietRecord,
  "date" | "type" | "amount" | "memo"
>;

export interface DietDayMarker {
  hasFood: boolean;
  hasSnack: boolean;
  foodAmount: number;
  snackAmount: number;
}

export interface CalendarDayCell {
  date: string | null;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
