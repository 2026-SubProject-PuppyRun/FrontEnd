import { CloseIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePetStore } from "@/store/usePetStore";
import { useVaccineStore } from "@/store/useVaccineStore";
import { VaccineFormValues, VaccineRecord } from "@/types/vaccine";
import { resolveRouteParam } from "@/util/navigation";
import { useGlobalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Share } from "react-native";

const buildVaccineShareMessage = (
  petName: string,
  records: VaccineRecord[],
) => {
  if (records.length === 0) return null;
  const lines = records.map(
    (record) =>
      `• ${record.name} · 접종일 ${record.vaccinatedAt} · 다음 ${record.nextVaccinationAt}`,
  );
  return [`[${petName}] 접종 기록`, "", ...lines].join("\n");
};

export const useVaccineTab = () => {
  const toast = useCustomToast();
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);
  const petName = usePetStore((state) =>
    petId ? state.petList?.find((p) => p.petId === petId)?.name : undefined,
  );

  const records = useVaccineStore((state) => state.records);
  const addRecord = useVaccineStore((state) => state.addRecord);
  const updateRecord = useVaccineStore((state) => state.updateRecord);
  const deleteRecord = useVaccineStore((state) => state.deleteRecord);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaccineRecord | null>(
    null,
  );

  const petRecords = useMemo(
    () => (petId ? records.filter((r) => r.petId === petId) : []),
    [records, petId],
  );

  const openAdd = () => {
    setEditingRecord(null);
    setSheetOpen(true);
  };

  const openEdit = (record: VaccineRecord) => {
    setEditingRecord(record);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = (values: VaccineFormValues) => {
    if (!petId) return;
    if (editingRecord) {
      updateRecord(editingRecord.id, values);
      return;
    }
    addRecord({ ...values, petId });
  };

  const handleDelete = () => {
    if (!editingRecord) return;
    deleteRecord(editingRecord.id);
    closeSheet();
  };

  const shareVaccine = useCallback(async () => {
    const message = buildVaccineShareMessage(petName ?? "반려견", petRecords);
    if (!message) {
      toast.showToast({
        message: "공유할 접종 기록이 없어요.",
        icon: CloseIcon,
        iconColor: "red",
      });
      return;
    }
    try {
      await Share.share({
        title: `${petName ?? "반려견"} 접종 기록`,
        message,
      });
    } catch {
      // share cancel
    }
  }, [petName, petRecords, toast]);

  return {
    petRecords,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    shareVaccine,
    handleDelete,
  };
};
