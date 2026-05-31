import { DUMMY_DIET_RECORDS } from "@/constants/dummyDietRecords";
import { DietRecord } from "@/types/diet";
import { create } from "zustand";

interface DietStore {
  records: DietRecord[];
  addRecord: (record: Omit<DietRecord, "id">) => string;
  updateRecord: (id: string, patch: Partial<DietRecord>) => void;
  deleteRecord: (id: string) => void;
}

export const useDietStore = create<DietStore>((set) => ({
  records: DUMMY_DIET_RECORDS,

  addRecord: (record) => {
    const id = `diet-${Date.now()}`;
    set((state) => ({
      records: [...state.records, { ...record, id }],
    }));
    return id;
  },

  updateRecord: (id, patch) =>
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),
}));
