import { DUMMY_ALLERGY_RECORDS } from "@/constants/dummyAllergyRecords";
import { AllergyRecord } from "@/types/allergy";
import { create } from "zustand";

interface AllergyStore {
  records: AllergyRecord[];
  getByPetId: (petId: string) => AllergyRecord[];
  addRecord: (record: Omit<AllergyRecord, "id">) => void;
  updateRecord: (id: string, patch: Partial<AllergyRecord>) => void;
  removeRecord: (id: string) => void;
}

export const useAllergyStore = create<AllergyStore>((set, get) => ({
  records: DUMMY_ALLERGY_RECORDS,

  getByPetId: (petId) =>
    get().records.filter((r) => r.petId === petId),

  addRecord: (record) =>
    set((state) => ({
      records: [
        ...state.records,
        { ...record, id: `allergy-${Date.now()}` },
      ],
    })),

  updateRecord: (id, patch) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    })),

  removeRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),
}));
