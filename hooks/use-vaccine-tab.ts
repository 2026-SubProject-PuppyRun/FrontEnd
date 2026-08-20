import { CloseIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePetStore } from "@/store/usePetStore";
import { VaccineFormValues, VaccineRecord } from "@/types/vaccine";
import {
  useCreateVaccinationMutation,
  useDeleteVaccinationMutation,
  useRefreshVaccineLogsOnFocus,
  useUpdateVaccinationMutation,
  useVaccineLogsQuery,
} from "@/util/api/vaccines";
import { resolveRouteParam } from "@/util/navigation";
import { useGlobalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Share } from "react-native";

const buildVaccineShareMessage = (
  petName: string,
  records: VaccineRecord[],
) => {
  if (records.length === 0) return null;
  const lines = records.map((record) => {
    const base = `• ${record.name} · 접종일 ${record.vaccinatedAt} · 다음 ${record.nextVaccinationAt}`;
    return record.memo ? `${base}\n  메모: ${record.memo}` : base;
  });
  return [`[${petName}] 접종 기록`, "", ...lines].join("\n");
};

export const useVaccineTab = () => {
  const toast = useCustomToast();
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);
  const petName = usePetStore((state) =>
    petId ? state.petList?.find((p) => p.petId === petId)?.name : undefined,
  );

  useRefreshVaccineLogsOnFocus(petId);

  const { data, isLoading, isError } = useVaccineLogsQuery(petId);

  const petRecords = useMemo(
    () => data?.records ?? [],
    [data?.records],
  );

  const createMutation = useCreateVaccinationMutation(petId);
  const updateMutation = useUpdateVaccinationMutation(petId);
  const deleteMutation = useDeleteVaccinationMutation(petId);
  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaccineRecord | null>(
    null,
  );

  const openAdd = () => {
    if (isSubmitting) return;
    setEditingRecord(null);
    setSheetOpen(true);
  };

  const openEdit = (record: VaccineRecord) => {
    if (isSubmitting) return;
    setEditingRecord(record);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    if (isSubmitting) return;
    setSheetOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: VaccineFormValues) => {
    if (!petId) return;

    try {
      if (editingRecord) {
        if (!editingRecord.id) {
          throw new Error("수정할 접종 기록 ID가 없습니다.");
        }
        await updateMutation.mutateAsync({
          vaccinationId: editingRecord.id,
          values,
        });
        toast.showToast({ message: "접종 기록이 수정되었습니다." });
        setEditingRecord(null);
      } else {
        await createMutation.mutateAsync(values);
        toast.showToast({ message: "접종 기록이 등록되었습니다." });
      }
    } catch {
      toast.showToast({
        message: editingRecord
          ? "접종 기록 수정에 실패했습니다."
          : "접종 기록 등록에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("vaccine mutation failed");
    }
  };

  const handleDelete = async () => {
    if (!petId || !editingRecord?.id) return;

    try {
      await deleteMutation.mutateAsync(editingRecord.id);
      toast.showToast({ message: "접종 기록이 삭제되었습니다." });
      setEditingRecord(null);
    } catch {
      toast.showToast({
        message: "접종 기록 삭제에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("vaccine delete failed");
    }
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
    isLoading,
    isError,
    isSubmitting,
  };
};
