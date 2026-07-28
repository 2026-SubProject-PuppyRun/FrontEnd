import WeightFormSheet from "@/components/sheet/WeightFormSheet";
import { Text } from "@/components/ui/text";
import { useWeightTab } from "@/hooks/use-weight-tab";
import { useCallback } from "react";
import { View } from "react-native";
import WeightAddFooter from "./weight/WeightAddFooter";
import WeightChart from "./weight/WeightChart";
import WeightPeriodTabs from "./weight/WeightPeriodTabs";
import WeightRecordList from "./weight/WeightRecordList";
import WeightSelectedPanel from "./weight/WeightSelectedPanel";
import WeightSummaryBar from "./weight/WeightSummaryBar";

const WeightBody = () => {
  const {
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
  } = useWeightTab();

  const renderListHeader = useCallback(
    () => (
      <View className="gap-4 pb-2">
        <WeightSummaryBar summary={summary} />

        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <WeightPeriodTabs period={period} onChange={setPeriod} />
          <WeightChart
            chartPoints={chartPoints}
            selectedRecordId={selectedRecordId}
            onSelectRecord={selectRecord}
            records={periodRecords}
          />
        </View>

        <WeightSelectedPanel record={selectedRecord} onPressEdit={openEdit} />

        <Text className="text-sm font-semibold text-[#0D0F1B]">기록 목록</Text>
      </View>
    ),
    [
      summary,
      period,
      setPeriod,
      chartPoints,
      selectedRecordId,
      selectRecord,
      periodRecords,
      selectedRecord,
      openEdit,
    ],
  );

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <WeightRecordList
        records={petRecords}
        selectedRecordId={selectedRecordId}
        onPressRecord={selectRecord}
        renderListHeader={renderListHeader}
      />
      <WeightAddFooter onPressAdd={openAdd} />
      <WeightFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default WeightBody;
