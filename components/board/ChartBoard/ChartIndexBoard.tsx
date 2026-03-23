import ChartTapButton from "@/components/button/ChartTapButton";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import CompareChart from "./CompareChart";
import MonthlyChart from "./MonthlyChart";
import WeeklyChart from "./WeeklyChart";
import YearlyChart from "./YearlyChart";

const ChartIndexBoard = () => {
  const [selectedChart, setSelectedChart] = useState("weekly");
  const handleSelectChart = (chart: string) => {
    setSelectedChart(chart);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "weekly":
        return <WeeklyChart />;
      case "monthly":
        return <MonthlyChart />;
      case "yearly":
        return <YearlyChart />;
      default:
        return null;
    }
  };

  return (
    <ScrollView className="mb-4 flex-1 bg-gray-100">
      <View className=" m-4 min-h-[400px] justify-around rounded-lg bg-white p-4">
        <View className="flex-row justify-around">
          <ChartTapButton
            handleSelectChart={handleSelectChart}
            label="주간"
            isActive={selectedChart === "weekly"}
          />
          <ChartTapButton
            handleSelectChart={handleSelectChart}
            label="월간"
            isActive={selectedChart === "monthly"}
          />
          <ChartTapButton
            handleSelectChart={handleSelectChart}
            label="연간"
            isActive={selectedChart === "yearly"}
          />
        </View>
        <View className="gap-4">{renderChart()}</View>
      </View>
      <CompareChart />
    </ScrollView>
  );
};

export default ChartIndexBoard;
