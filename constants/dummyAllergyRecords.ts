import { AllergyRecord } from "@/types/allergy";

export const DUMMY_ALLERGY_RECORDS: AllergyRecord[] = [
  {
    id: "allergy-1",
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    category: "food",
    allergen: "닭고기",
    severity: "moderate",
    symptoms: "가려움, 설사",
    diagnosedAt: "2024-03-15T00:00:00",
    isActive: true,
  },
  {
    id: "allergy-2",
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    category: "environment",
    allergen: "꽃가루",
    severity: "mild",
    symptoms: "재채기",
    diagnosedAt: "2023-06-01T00:00:00",
    isActive: true,
  },
  {
    id: "allergy-3",
    petId: "d4563324-17d6-477e-a326-bd3d94ee50cd",
    category: "medication",
    allergen: "항생제(특정 성분)",
    severity: "severe",
    symptoms: "구토",
    diagnosedAt: null,
    isActive: false,
  },
];
