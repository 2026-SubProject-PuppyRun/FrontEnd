import { VaccineRecord } from "@/types/vaccine";

export const DUMMY_VACCINE_RECORDS: VaccineRecord[] = [
  {
    id: "vaccine-1",
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    name: "종합백신",
    vaccinatedAt: "2025-01-12",
    nextVaccinationAt: "2026-01-12",
  },
  {
    id: "vaccine-2",
    petId: "d4563324-17d6-477e-a326-bd3d94ee50cd",
    name: "광견병",
    vaccinatedAt: "2025-04-10",
    nextVaccinationAt: "2026-04-10",
  },
];
