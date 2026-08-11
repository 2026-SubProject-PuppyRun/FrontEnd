import ChartTapButton from "@/components/button/ChartTapButton";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import CompareChart from "./BoardItem/CompareChart";
import GrassChart from "./BoardItem/GrassChart";
import MonthlyChart from "./BoardItem/MonthlyChart";
import StarChart from "./BoardItem/StarChart";
import UserInsight from "./BoardItem/UserInsight";
import WeeklyChart from "./BoardItem/WeeklyChart";

const CHART_TABS = [
  { label: "주간", value: "weekly" },
  { label: "월간", value: "monthly" },
] as const;

const ChartBoardBody = () => {
  const [selectedChart, setSelectedChart] = useState("weekly");

  const renderChart = () => {
    switch (selectedChart) {
      case "weekly":
        return <WeeklyChart />;
      case "monthly":
        return <MonthlyChart />;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <UserInsight />

      <View className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="mb-4 text-sm font-semibold text-gray-500">
          기간별 산책량
        </Text>

        <View className="mb-5 flex-row rounded-2xl bg-[#F7F7F7] p-1">
          {CHART_TABS.map((tab) => (
            <ChartTapButton
              key={tab.value}
              handleSelectChart={setSelectedChart}
              label={tab.label}
              value={tab.value}
              isActive={selectedChart === tab.value}
            />
          ))}
        </View>

        <View className="gap-4">{renderChart()}</View>
      </View>

      <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
        반려견별 산책 비율
      </Text>
      <CompareChart />

      <Text className="mb-3 mt-5 text-base font-semibold text-[#0D0F1B]">
        주간 활동 비교
      </Text>
      <StarChart />

      <Text className="mb-3 mt-5 text-base font-semibold text-[#0D0F1B]">
        산책 잔디심기
      </Text>
      <GrassChart />
    </ScrollView>
  );
};

export default ChartBoardBody;
