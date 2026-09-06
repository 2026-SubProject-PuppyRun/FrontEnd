import { CloseIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePetStore } from "@/store/usePetStore";
import { AllergyFormValues, AllergyRecord } from "@/types/allergy";
import {
  useAllergyLogsQuery,
  useCreateAllergyMutation,
  useDeleteAllergyMutation,
  useRefreshAllergyLogsOnFocus,
  useUpdateAllergyMutation,
} from "@/util/api/allergies";
import {
  buildActiveAllergySummary,
  formatAllergyShareMessage,
} from "@/util/allergy";
import { resolveRouteParam } from "@/util/navigation";
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

  useRefreshAllergyLogsOnFocus(petId);

  const { data, isLoading, isError } = useAllergyLogsQuery(petId);

  const createMutation = useCreateAllergyMutation(petId);
  const updateMutation = useUpdateAllergyMutation(petId);
  const deleteMutation = useDeleteAllergyMutation(petId);
  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const petRecords = useMemo(
    () => data?.records ?? [],
    [data?.records],
  );

  const activeSummary = useMemo(
    () => buildActiveAllergySummary(petRecords),
    [petRecords],
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AllergyRecord | null>(
    null,
  );

  const openAdd = () => {
    if (isSubmitting) return;
    setEditingRecord(null);
    setSheetOpen(true);
  };

  const openEdit = (record: AllergyRecord) => {
    if (isSubmitting) return;
    setEditingRecord(record);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    if (isSubmitting) return;
    setSheetOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: AllergyFormValues) => {
    if (!petId) return;

    try {
      if (editingRecord) {
        if (!editingRecord.id) {
          throw new Error("수정할 알러지 기록 ID가 없습니다.");
        }
        await updateMutation.mutateAsync({
          allergyId: editingRecord.id,
          values,
        });
        toast.showToast({ message: "알러지 기록이 수정되었습니다." });
        setEditingRecord(null);
      } else {
        await createMutation.mutateAsync(values);
        toast.showToast({ message: "알러지 기록이 등록되었습니다." });
      }
    } catch {
      toast.showToast({
        message: editingRecord
          ? "알러지 기록 수정에 실패했습니다."
          : "알러지 기록 등록에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("allergy mutation failed");
    }
  };

  const handleDelete = async () => {
    if (!petId || !editingRecord?.id) return;

    try {
      await deleteMutation.mutateAsync(editingRecord.id);
      toast.showToast({ message: "알러지 기록이 삭제되었습니다." });
      setEditingRecord(null);
    } catch {
      toast.showToast({
        message: "알러지 기록 삭제에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("allergy delete failed");
    }
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
    handleDelete,
    shareAllergy,
    isLoading,
    isError,
    isSubmitting,
  };
};
