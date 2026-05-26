import { Pet } from "@/store/usePetStore";

/** 개발용 더미 펫 — 수정 후 저장 시 목장 스프라이트에 반영됨 */
export const DUMMY_PET_LIST: Pet[] = [
  {
    petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
    name: "두부",
    birthYear: "2021-05-20T00:00:00",
    weight: 4.5,
    color: "#FFFFF0",
    profileImageUrl: "https://picsum.photos/200/200?random=1",
    breedCode: "301",
    badgeCode: "000",
    gender: "M",
    isNeutered: true,
  },
  {
    petId: "d4563324-17d6-477e-a326-bd3d94ee50cd",
    name: "누렁이",
    birthYear: "2024-05-20T00:00:00",
    weight: 4.2,
    color: "#CD853F",
    profileImageUrl: "https://picsum.photos/200/200?random=2",
    breedCode: "101",
    badgeCode: "000",
    gender: "F",
    isNeutered: false,
  },
];
