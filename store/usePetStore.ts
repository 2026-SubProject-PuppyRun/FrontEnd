import { create } from "zustand";

export interface Pet {
  badgeCode: string;
  birthYear: string | null;
  breedCode: string;
  color: string;
  name: string;
  petId: string;
  mbti?: string;
  profileImageUrl: string | null;
  weight: number;
  isNeutered?: boolean;
  gender?: "F" | "M";
}

interface PetStore {
  totalPetCount: number | null;
  petList: Pet[] | null;
  setPetList: (petList: Pet[] | null, totalPetCount?: number) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  totalPetCount: null,
  petList: null,
  setPetList: (petList, totalPetCount) => {
    set({ petList, totalPetCount: totalPetCount || petList?.length || 0 });
  },
}));
