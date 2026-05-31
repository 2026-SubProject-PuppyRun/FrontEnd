import { DietRecord } from "@/types/diet";

const PET_ID = "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09";

export const DUMMY_DIET_RECORDS: DietRecord[] = [
  {
    id: "diet-1",
    petId: PET_ID,
    date: "2026-05-01",
    type: "food",
    amount: 120,
  },
  {
    id: "diet-2",
    petId: PET_ID,
    date: "2026-05-01",
    type: "snack",
    amount: 15,
  },
  {
    id: "diet-3",
    petId: PET_ID,
    date: "2026-05-03",
    type: "food",
    amount: 115,
  },
  {
    id: "diet-4",
    petId: PET_ID,
    date: "2026-05-05",
    type: "food",
    amount: 120,
    memo: "저녁 조금 줄임",
  },
  {
    id: "diet-5",
    petId: PET_ID,
    date: "2026-05-05",
    type: "snack",
    amount: 20,
  },
  {
    id: "diet-6",
    petId: PET_ID,
    date: "2026-05-08",
    type: "snack",
    amount: 10,
  },
  {
    id: "diet-7",
    petId: PET_ID,
    date: "2026-05-10",
    type: "food",
    amount: 118,
  },
  {
    id: "diet-8",
    petId: PET_ID,
    date: "2026-05-12",
    type: "food",
    amount: 120,
  },
  {
    id: "diet-9",
    petId: PET_ID,
    date: "2026-05-12",
    type: "snack",
    amount: 12,
  },
  {
    id: "diet-10",
    petId: PET_ID,
    date: "2026-05-28",
    type: "food",
    amount: 120,
  },
  {
    id: "diet-11",
    petId: PET_ID,
    date: "2026-05-28",
    type: "snack",
    amount: 18,
  },
];
