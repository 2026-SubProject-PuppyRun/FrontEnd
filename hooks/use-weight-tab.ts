import {
  useCreateWeightLogMutation,
  useRefreshWeightLogsOnFocus,
  useWeightLogsQuery,
} from "@/util/api/weights";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePetStore } from "@/store/usePetStore";
import { WeightFormValues, WeightPeriod, WeightRecord } from "@/types/weight";
import {
  buildWeightChartData,
  buildWeightSummary,
  filterRecordsByPeriod,
} from "@/util/weight";
import { resolveRouteParam } from "@/util/navigation";
import { CloseIcon } from "@/components/ui/icon";
import { useGlobalSearchParams } from "expo-router";
import { useMemo, useState, useCallback } from "react";

const sortByMeasuredAtDesc = (records: WeightRecord[]) =>
  [...records].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt));

export const useWeightTab = () => {
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);
  const toast = useCustomToast();

  useRefreshWeightLogsOnFocus(petId);

  const pet = usePetStore((state) =>
    petId ? state.petList?.find((p) => p.petId === petId) : undefined,
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useWeightLogsQuery(petId);

  const createMutation = useCreateWeightLogMutation(petId);
  const isSubmitting = createMutation.isPending;

  const petRecords = useMemo(
    () => sortByMeasuredAtDesc(data?.records ?? []),
    [data?.records],
  );

  const [period, setPeriod] = useState<WeightPeriod>("3m");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    null,
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
    setSelectedRecordId((prev) => (prev === record.id ? null : record.id));
  }, []);

  const openAdd = useCallback(() => {
    if (isSubmitting) return;
    setSheetOpen(true);
  }, [isSubmitting]);

  const closeSheet = useCallback(() => {
    if (isSubmitting) return;
    setSheetOpen(false);
  }, [isSubmitting]);

  const handleSubmit = async (values: WeightFormValues) => {
    if (!petId) return;

    try {
      const record = await createMutation.mutateAsync(values.weight);
      toast.showToast({ message: "체중 기록이 등록되었습니다." });
      setSelectedRecordId(record.id);
    } catch {
      toast.showToast({
        message: "체중 기록 등록에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("weight mutation failed");
    }
  };

  return {
    periodRecords,
    chartPoints,
    summary,
    period,
    setPeriod,
    selectedRecord,
    selectedRecordId,
    selectRecord,
    sheetOpen,
    openAdd,
    closeSheet,
    handleSubmit,
    isLoading,
    isError,
    refetch,
    isSubmitting,
  };
};
