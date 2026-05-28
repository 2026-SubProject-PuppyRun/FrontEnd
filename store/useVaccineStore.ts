import { DUMMY_VACCINE_RECORDS } from "@/constants/dummyVaccineRecords";
import { VaccineRecord } from "@/types/vaccine";
import { create } from "zustand";

interface VaccineStore {
  records: VaccineRecord[];
  addRecord: (record: Omit<VaccineRecord, "id">) => void;
  updateRecord: (id: string, patch: Partial<VaccineRecord>) => void;
}

export const useVaccineStore = create<VaccineStore>((set) => ({
  records: DUMMY_VACCINE_RECORDS,

  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, { ...record, id: `vaccine-${Date.now()}` }],
    })),

  updateRecord: (id, patch) =>
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
}));
