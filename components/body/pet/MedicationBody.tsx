import MedicationAddFooter from "@/components/body/pet/medication/MedicationAddFooter";
import MedicationCalendar from "@/components/body/pet/medication/MedicationCalendar";
import MedicationLegend from "@/components/body/pet/medication/MedicationLegend";
import MedicationMonthHeader from "@/components/body/pet/medication/MedicationMonthHeader";
import MedicationSelectedDayPanel from "@/components/body/pet/medication/MedicationSelectedDayPanel";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import MedicationFormSheet from "@/components/sheet/MedicationFormSheet";
import { Text } from "@/components/ui/text";
import { useMedicationTab } from "@/hooks/use-medication-tab";
import { Pressable, ScrollView, View } from "react-native";

const MedicationBody = () => {
  const {
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
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
    isLoading,
    isError,
    refetch,
    isSubmitting,
  } = useMedicationTab();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center rounded-3xl bg-white px-4 py-8">
        <Text className="text-center text-sm text-gray-500">
          투약 기록을 불러오지 못했어요.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-3 rounded-full bg-[#F7F7F7] px-4 py-2"
        >
          <Text className="text-sm font-semibold text-[#6366F1]">
            다시 시도
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl bg-white pb-2 pt-1 shadow-sm">
          <MedicationMonthHeader
            month={currentMonth}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            onToday={goToToday}
          />
          <MedicationLegend />
          <MedicationCalendar
            cells={calendarCells}
            dayMarkers={dayMarkers}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
          />
        </View>

        <View className="mt-3">
          <MedicationSelectedDayPanel
            selectedDate={selectedDate}
            marker={selectedDayMarker}
            records={selectedDayRecords}
            onPressRecord={openEdit}
          />
        </View>
      </ScrollView>

      <MedicationAddFooter onPressAdd={openAdd} disabled={isSubmitting} />

      <MedicationFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        defaultDate={selectedDate}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default MedicationBody;
