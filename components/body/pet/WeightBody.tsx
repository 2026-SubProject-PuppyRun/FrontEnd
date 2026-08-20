import WeightFormSheet from "@/components/sheet/WeightFormSheet";
import { useWeightTab } from "@/hooks/use-weight-tab";
import { ScrollView, View } from "react-native";
import WeightAddFooter from "./weight/WeightAddFooter";
import WeightChart from "./weight/WeightChart";
import WeightPeriodTabs from "./weight/WeightPeriodTabs";
import WeightSelectedPanel from "./weight/WeightSelectedPanel";
import WeightSummaryBar from "./weight/WeightSummaryBar";

const WeightBody = () => {
  const {
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
    isSubmitting,
  } = useWeightTab();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 pb-36 pt-1"
        showsVerticalScrollIndicator={false}
      >
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

        <WeightSelectedPanel record={selectedRecord} />
      </ScrollView>

      <WeightAddFooter onPressAdd={openAdd} />
      <WeightFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default WeightBody;
