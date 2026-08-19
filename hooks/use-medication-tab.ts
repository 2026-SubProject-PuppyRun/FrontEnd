import {
  useCreateMedicationLogMutation,
  useDeleteMedicationLogMutation,
  useMedicationLogsQuery,
  useRefreshMedicationLogsOnFocus,
  useUpdateMedicationLogMutation,
} from "@/util/api/medications";
import {
  MedicationFormValues,
  MedicationRecord,
} from "@/types/medication";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { buildCalendarGrid } from "@/util/diet";
import { buildMedicationDayMarkers } from "@/util/medication";
import { resolveRouteParam } from "@/util/navigation";
import { CloseIcon } from "@/components/ui/icon";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

const sortByAdministeredAtDesc = (records: MedicationRecord[]) =>
  [...records].sort((a, b) => b.administeredAt.localeCompare(a.administeredAt));

export const useMedicationTab = () => {
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);
  const toast = useCustomToast();

  useRefreshMedicationLogsOnFocus(petId);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMedicationLogsQuery(petId);

  const petRecords = useMemo(
    () => sortByAdministeredAtDesc(data?.records ?? []),
    [data?.records],
  );

  const createMutation = useCreateMedicationLogMutation(petId);
  const updateMutation = useUpdateMedicationLogMutation(petId);
  const deleteMutation = useDeleteMedicationLogMutation(petId);

  const [currentMonth, setCurrentMonth] = useState(() =>
    dayjs().startOf("month"),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicationRecord | null>(
    null,
  );

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    const today = dayjs();
    setCurrentMonth(today.startOf("month"));
    setSelectedDate(today.format("YYYY-MM-DD"));
  }, [petId]);

  const dayMarkers = useMemo(
    () => buildMedicationDayMarkers(petRecords),
    [petRecords],
  );

  const calendarCells = useMemo(
    () => buildCalendarGrid(currentMonth),
    [currentMonth],
  );

  const selectedDayRecords = useMemo(
    () =>
      selectedDate
        ? petRecords
            .filter((r) => r.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
        : [],
    [petRecords, selectedDate],
  );

  const selectedDayMarker = selectedDate ? dayMarkers[selectedDate] : undefined;

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((month) =>
      dayjs(month).subtract(1, "month").startOf("month"),
    );
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((month) => dayjs(month).add(1, "month").startOf("month"));
  }, []);

  const goToToday = useCallback(() => {
    const today = dayjs();
    setCurrentMonth(today.startOf("month"));
    setSelectedDate(today.format("YYYY-MM-DD"));
  }, []);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setCurrentMonth((prev) => {
      const targetMonth = dayjs(date).startOf("month");
      return prev.isSame(targetMonth, "month") ? prev : targetMonth;
    });
  }, []);

  const openAdd = useCallback(() => {
    if (isSubmitting) return;
    setEditingRecord(null);
    setSheetOpen(true);
  }, [isSubmitting]);

  const openEdit = useCallback((record: MedicationRecord) => {
    if (isSubmitting) return;
    setEditingRecord(record);
    setSelectedDate(record.date);
    setCurrentMonth(dayjs(record.date).startOf("month"));
    setSheetOpen(true);
  }, [isSubmitting]);

  const closeSheet = useCallback(() => {
    if (isSubmitting) return;
    setSheetOpen(false);
    setEditingRecord(null);
  }, [isSubmitting]);

  const handleSubmit = async (values: MedicationFormValues) => {
    if (!petId) return;

    try {
      if (editingRecord) {
        if (!editingRecord.id) {
          throw new Error("수정할 투약 기록 ID가 없습니다.");
        }

        await updateMutation.mutateAsync({
          medicationLogId: editingRecord.id,
          values,
        });
        toast.showToast({ message: "투약 기록이 수정되었습니다." });
      } else {
        await createMutation.mutateAsync(values);
        toast.showToast({ message: "투약 기록이 등록되었습니다." });
      }

      setSelectedDate(values.date);
      setCurrentMonth(dayjs(values.date).startOf("month"));
      setEditingRecord(null);
    } catch {
      toast.showToast({
        message: editingRecord
          ? "투약 기록 수정에 실패했습니다."
          : "투약 기록 등록에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("medication mutation failed");
    }
  };

  const handleDelete = async () => {
    if (!editingRecord?.id) return;

    try {
      await deleteMutation.mutateAsync(editingRecord.id);
      toast.showToast({ message: "투약 기록이 삭제되었습니다." });
      setEditingRecord(null);
      closeSheet();
    } catch {
      toast.showToast({
        message: "투약 기록 삭제에 실패했습니다.",
        icon: CloseIcon,
      });
      throw new Error("medication delete failed");
    }
  };

  return {
    currentMonth,
    selectedDate,
    calendarCells,
    dayMarkers,
    selectedDayRecords,
    selectedDayMarker,
    totalCount: data?.totalCount ?? 0,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
    isLoading,
    isError,
    refetch,
    isSubmitting,
  };
};

export type MedicationTabState = ReturnType<typeof useMedicationTab> & {
  currentMonth: Dayjs;
};
