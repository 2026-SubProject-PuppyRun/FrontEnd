import { DUMMY_WEIGHT_RECORDS } from "@/constants/dummyWeightRecords";
import { WeightRecord } from "@/types/weight";
import { create } from "zustand";

interface WeightStore {
  records: WeightRecord[];
  addRecord: (record: Omit<WeightRecord, "id">) => string;
  updateRecord: (id: string, patch: Partial<WeightRecord>) => void;
  deleteRecord: (id: string) => void;
}

export const useWeightStore = create<WeightStore>((set) => ({
  records: DUMMY_WEIGHT_RECORDS,

  addRecord: (record) => {
    const id = `weight-${Date.now()}`;
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
