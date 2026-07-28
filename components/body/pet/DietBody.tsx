import DietAddFooter from "@/components/body/pet/diet/DietAddFooter";
import DietCalendar from "@/components/body/pet/diet/DietCalendar";
import DietLegend from "@/components/body/pet/diet/DietLegend";
import DietMonthHeader from "@/components/body/pet/diet/DietMonthHeader";
import DietSelectedDayPanel from "@/components/body/pet/diet/DietSelectedDayPanel";
import DietFormSheet from "@/components/sheet/DietFormSheet";
import { useDietTab } from "@/hooks/use-diet-tab";
import { ScrollView, View } from "react-native";

const DietBody = () => {
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
    initialAddType,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
  } = useDietTab();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 rounded-3xl bg-white p-2 shadow-sm">
          <DietMonthHeader
            month={currentMonth}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            onToday={goToToday}
          />
          <DietLegend />
          <DietCalendar
            cells={calendarCells}
            dayMarkers={dayMarkers}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
          />
        </View>

        <DietSelectedDayPanel
          selectedDate={selectedDate}
          marker={selectedDayMarker}
          records={selectedDayRecords}
          onPressRecord={openEdit}
        />
      </ScrollView>

      <DietAddFooter onPressAdd={openAdd} />

      <DietFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        defaultDate={selectedDate}
        defaultType={initialAddType}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default DietBody;
