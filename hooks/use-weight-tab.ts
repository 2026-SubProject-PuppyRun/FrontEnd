import { usePetStore } from "@/store/usePetStore";
import { useWeightStore } from "@/store/useWeightStore";
import { WeightFormValues, WeightPeriod, WeightRecord } from "@/types/weight";
import {
  buildWeightChartData,
  buildWeightSummary,
  filterRecordsByPeriod,
} from "@/util/weight";
import { resolveRouteParam } from "@/util/navigation";
import { useGlobalSearchParams } from "expo-router";
import { useMemo, useState, useCallback } from "react";

export const useWeightTab = () => {
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);

  const pet = usePetStore((state) =>
    petId ? state.petList?.find((p) => p.petId === petId) : undefined,
  );

  const records = useWeightStore((state) => state.records);
  const addRecord = useWeightStore((state) => state.addRecord);
  const updateRecord = useWeightStore((state) => state.updateRecord);
  const deleteRecord = useWeightStore((state) => state.deleteRecord);

  const [period, setPeriod] = useState<WeightPeriod>("3m");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const petRecords = useMemo(
    () =>
      petId
        ? [...records.filter((r) => r.petId === petId)].sort((a, b) =>
            b.measuredAt.localeCompare(a.measuredAt),
          )
        : [],
    [records, petId],
  );

  const periodRecords = useMemo(
    () => filterRecordsByPeriod(petRecords, period),
    [petRecords, period],
  );

  const chartPoints = useMemo(
    () => buildWeightChartData(periodRecords),
    [periodRecords],
  );

  const summary = useMemo(
    () => buildWeightSummary(petRecords, pet?.breedCode),
    [petRecords, pet?.breedCode],
  );

  const selectedRecord = useMemo(
    () => petRecords.find((record) => record.id === selectedRecordId) ?? null,
    [petRecords, selectedRecordId],
  );

  const selectRecord = useCallback((record: WeightRecord) => {
    setSelectedRecordId(record.id);
  }, []);

  const openAdd = useCallback(() => {
    setEditingRecord(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((record: WeightRecord) => {
    setEditingRecord(record);
    setSelectedRecordId(record.id);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditingRecord(null);
  }, []);

  const handleSubmit = (values: WeightFormValues) => {
    if (!petId) return;

    const payload = {
      ...values,
      weight: Number(values.weight),
      memo: values.memo?.trim() || undefined,
    };

    if (editingRecord) {
      updateRecord(editingRecord.id, payload);
      setSelectedRecordId(editingRecord.id);
      return;
    }

    const newId = addRecord({ ...payload, petId });
    setSelectedRecordId(newId);
  };

  const handleDelete = () => {
    if (!editingRecord) return;
    deleteRecord(editingRecord.id);
    if (selectedRecordId === editingRecord.id) {
      setSelectedRecordId(null);
    }
    closeSheet();
  };

  return {
    petRecords,
    periodRecords,
    chartPoints,
    summary,
    period,
    setPeriod,
    selectedRecord,
    selectedRecordId,
    selectRecord,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
  };
};
