import { VaccineRecord } from "@/types/vaccine";

export const DUMMY_VACCINE_RECORDS: VaccineRecord[] = [
  {
    id: "vaccine-1",
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    name: "종합백신",
    vaccinatedAt: "2025-08-05",
    nextVaccinationAt: "2026-08-05",
    memo: "해피동물병원 · 이상 반응 없음",
  },
  {
    id: "vaccine-2",
    petId: "d4563324-17d6-477e-a326-bd3d94ee50cd",
    name: "광견병",
    vaccinatedAt: "2025-08-07",
    nextVaccinationAt: "2026-08-07",
  },
  {
    id: "vaccine-3",
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    name: "코로나 장염",
    vaccinatedAt: "2025-07-20",
    nextVaccinationAt: "2026-08-03",
    memo: "2차 접종 완료",
  },
];
