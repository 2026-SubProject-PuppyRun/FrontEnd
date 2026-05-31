import { useDietStore } from "@/store/useDietStore";
import { DietFormValues, DietMealType, DietRecord } from "@/types/diet";
import { buildCalendarGrid, buildDietDayMarkers } from "@/util/diet";
import { resolveRouteParam } from "@/util/navigation";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export const useDietTab = () => {
  const params = useGlobalSearchParams<{ petId: string }>();
  const petId = resolveRouteParam(params.petId);

  const records = useDietStore((state) => state.records);
  const addRecord = useDietStore((state) => state.addRecord);
  const updateRecord = useDietStore((state) => state.updateRecord);
  const deleteRecord = useDietStore((state) => state.deleteRecord);

  const [currentMonth, setCurrentMonth] = useState(() => dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DietRecord | null>(null);
  const [initialAddType, setInitialAddType] = useState<DietMealType | undefined>();

  const petRecords = useMemo(
    () => (petId ? records.filter((r) => r.petId === petId) : []),
    [records, petId],
  );

  const dayMarkers = useMemo(
    () => buildDietDayMarkers(petRecords),
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
            .sort((a, b) => a.type.localeCompare(b.type))
        : [],
    [petRecords, selectedDate],
  );

  const selectedDayMarker = selectedDate ? dayMarkers[selectedDate] : undefined;

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((month) => dayjs(month).subtract(1, "month").startOf("month"));
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

  const openAdd = useCallback(
    (type?: DietMealType) => {
      setEditingRecord(null);
      setInitialAddType(type);
      setSheetOpen(true);
    },
    [],
  );

  const openEdit = useCallback((record: DietRecord) => {
    setEditingRecord(record);
    setInitialAddType(undefined);
    setSelectedDate(record.date);
    setCurrentMonth(dayjs(record.date).startOf("month"));
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditingRecord(null);
    setInitialAddType(undefined);
  }, []);

  const handleSubmit = (values: DietFormValues) => {
    if (!petId) return;

    const payload = {
      ...values,
      amount: Number(values.amount),
      memo: values.memo?.trim() || undefined,
    };

    if (editingRecord) {
      updateRecord(editingRecord.id, payload);
      setSelectedDate(payload.date);
      setCurrentMonth(dayjs(payload.date).startOf("month"));
      return;
    }

    addRecord({ ...payload, petId });
    setSelectedDate(payload.date);
    setCurrentMonth(dayjs(payload.date).startOf("month"));
  };

  const handleDelete = () => {
    if (!editingRecord) return;
    deleteRecord(editingRecord.id);
    closeSheet();
  };

  return {
    currentMonth,
    selectedDate,
    calendarCells,
    dayMarkers,
    selectedDayRecords,
    selectedDayMarker,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    sheetOpen,
    editingRecord,
    initialAddType,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
  };
};

export type DietTabState = ReturnType<typeof useDietTab> & {
  currentMonth: Dayjs;
};
