import { create } from "zustand";

export interface Pet {
  badgeCode: string;
  birthYear: string;
  breedCode: string;
  color: string;
  name: string;
  petId: string;
  profileImageUrl: string | null;
  weight: number;
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
