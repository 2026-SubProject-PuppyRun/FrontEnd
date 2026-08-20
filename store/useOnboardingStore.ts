import { AllergySeverity } from "@/types/allergy";
import { create } from "zustand";

export type OnboardingAllergy = {
  id: string;
  allergen: string;
  severity?: AllergySeverity;
};

export type OnboardingVaccine = {
  id: string;
  name: string;
  vaccinatedAt: string;
  nextVaccinationAt: string;
  memo?: string;
};

export type OnboardingDraft = {
  name: string;
  profileImage: string;
  gender: "F" | "M" | undefined;
  birthDate: string | null;
  breedCode: string;
  color: string;
  isNeutered: boolean;
  weight: string;
  allergies: OnboardingAllergy[];
  vaccines: OnboardingVaccine[];
};

type DraftField = keyof OnboardingDraft;

interface OnboardingStore extends OnboardingDraft {
  setField: <K extends DraftField>(field: K, value: OnboardingDraft[K]) => void;
  addAllergy: (allergy: Omit<OnboardingAllergy, "id">) => void;
  addVaccine: (vaccine: Omit<OnboardingVaccine, "id">) => void;
  removeAllergy: (id: string) => void;
  removeVaccine: (id: string) => void;
  reset: () => void;
}

const INITIAL_DRAFT: OnboardingDraft = {
  name: "",
  profileImage: "",
  gender: undefined,
  birthDate: "",
  breedCode: "",
  color: "#F2F2F2",
  isNeutered: false,
  weight: "",
  allergies: [],
  vaccines: [],
};

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...INITIAL_DRAFT,
  setField: (field, value) => set({ [field]: value }),
  addAllergy: (allergy) =>
    set((state) => ({
      allergies: [...state.allergies, { ...allergy, id: createId() }],
    })),
  addVaccine: (vaccine) =>
    set((state) => ({
      vaccines: [...state.vaccines, { ...vaccine, id: createId() }],
    })),
  removeAllergy: (id) =>
    set((state) => ({
      allergies: state.allergies.filter((item) => item.id !== id),
    })),
  removeVaccine: (id) =>
    set((state) => ({
      vaccines: state.vaccines.filter((item) => item.id !== id),
    })),
  reset: () => set({ ...INITIAL_DRAFT }),
}));
