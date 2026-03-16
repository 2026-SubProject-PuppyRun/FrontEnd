import ChartTapButton from "@/components/button/ChartTapButton";
import { Spinner } from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import MonthlyChart from "./MonthlyChart";
import WeeklyChart from "./WeeklyChart";
import YearlyChart from "./YearlyChart";

interface ChartData {
  weekly: {
    label: string;
    value: number;
  }[];
  monthly: {
    label: string;
    value: number;
  }[];
  yearly: {
    label: string;
    value: number;
  }[];
}

const DummyData: ChartData = {
  weekly: [
    { label: "월", value: 10 },
    { label: "화", value: 20 },
    { label: "수", value: 30 },
    { label: "목", value: 40 },
    { label: "금", value: 50 },
    { label: "토", value: 60 },
    { label: "일", value: 70 },
  ],
  monthly: [
    { label: "1월", value: 100 },
    { label: "2월", value: 200 },
    { label: "3월", value: 300 },
    { label: "4월", value: 400 },
    { label: "5월", value: 500 },
    { label: "6월", value: 600 },
    { label: "7월", value: 700 },
    { label: "8월", value: 800 },
    { label: "9월", value: 900 },
    { label: "10월", value: 1000 },
    { label: "11월", value: 1100 },
    { label: "12월", value: 1200 },
  ],
  yearly: [
    { label: "2020", value: 1000 },
    { label: "2021", value: 2000 },
    { label: "2022", value: 3000 },
    { label: "2023", value: 4000 },
  ],
};

const ChartIndexBoard = () => {
  const [selectedChart, setSelectedChart] = useState("weekly");
  const handleSelectChart = (chart: string) => {
    setSelectedChart(chart);
  };
  const [chartData, setChartData] = useState<ChartData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setChartData(DummyData);
    };
    fetchData();
  }, []);

  const renderChart = () => {
    if (!chartData)
      return (
        <View className="mb-6 flex-1 items-center justify-center">
          <Spinner size="large" color="#BFB8AA" />
        </View>
      );
    switch (selectedChart) {
      case "weekly":
        return <WeeklyChart data={chartData.weekly} />;
      case "monthly":
        return <MonthlyChart data={chartData.monthly} />;
      case "yearly":
        return <YearlyChart data={chartData.yearly} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className=" m-4 rounded-lg bg-white p-4">
        <View className="flex-row justify-around  ">
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
        <View className="py-4">{renderChart()}</View>
      </View>
    </ScrollView>
  );
};

export default ChartIndexBoard;
