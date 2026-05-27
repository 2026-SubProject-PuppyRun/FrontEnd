import { CloseIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useAllergyStore } from "@/store/useAllergyStore";
import { usePetStore } from "@/store/usePetStore";
import { AllergyFormValues, AllergyRecord } from "@/types/allergy";
import { buildActiveAllergySummary } from "@/util/buildActiveAllergySummary";
import { formatAllergyShareMessage } from "@/util/formatAllergyShareMessage";
import { resolveRouteParam } from "@/util/resolveRouteParam";
import { useGlobalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Share } from "react-native";

export const useAllergyTab = () => {
  const toast = useCustomToast();
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);
  const petName = usePetStore((state) =>
    petId ? state.petList?.find((p) => p.petId === petId)?.name : undefined,
  );

  const records = useAllergyStore((state) => state.records);
  const addRecord = useAllergyStore((state) => state.addRecord);
  const updateRecord = useAllergyStore((state) => state.updateRecord);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AllergyRecord | null>(
    null,
  );

  const petRecords = useMemo(
    () => (petId ? records.filter((r) => r.petId === petId) : []),
    [records, petId],
  );

  const activeSummary = useMemo(
    () => buildActiveAllergySummary(petRecords),
    [petRecords],
  );

  const openAdd = () => {
    setEditingRecord(null);
    setSheetOpen(true);
  };

  const openEdit = (record: AllergyRecord) => {
    setEditingRecord(record);
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const handleSubmit = (values: AllergyFormValues) => {
    if (!petId) return;

    if (editingRecord) {
      updateRecord(editingRecord.id, values);
      return;
    }

    addRecord({ ...values, petId });
  };

  const shareAllergy = useCallback(async () => {
    const message = formatAllergyShareMessage(
      petName ?? "반려견",
      petRecords,
    );

    if (!message) {
      toast.showToast({
        message: "공유할 현재 해당 알러지가 없어요.",
        icon: CloseIcon,
        iconColor: "red",
      });
      return;
    }

    try {
      await Share.share({
        title: `${petName ?? "반려견"} 알러지 기록`,
        message,
      });
    } catch {
      // 사용자가 공유 취소한 경우 등 — 무시
    }
  }, [petName, petRecords, toast]);

  return {
    petId,
    petRecords,
    activeSummary,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    shareAllergy,
  };
};
