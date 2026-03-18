import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import { getWeekName } from "@/util/getWeekOfMonth";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
const WeeklyData: { label: string; value: number }[] = [
  { label: "일", value: 70 },
  { label: "월", value: 10 },
  { label: "화", value: 20 },
  { label: "수", value: 30 },
  { label: "목", value: 40 },
  { label: "금", value: 50 },
  { label: "토", value: 60 },
];

const WeeklyChart = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const year = currentDate.year();
  const month = currentDate.month() + 1;
  const weekName = getWeekName(currentDate);
  const dateText = `${year}년 ${month}월 ${weekName} 주`;
  const weekKey = currentDate.startOf("week").format("YYYY-MM-DD");

  const handlePrevWeek = () => {
    setCurrentDate((prev) => prev.subtract(1, "week"));
  };
  const handleNextWeek = () => {
    setCurrentDate((prev) => prev.add(1, "week"));
  };
  const { data, isLoading } = useQuery({
    queryKey: ["weeklyData", weekKey],
    queryFn: async () => {
      console.log("fetching weekly data for", weekKey);
      return WeeklyData;
    },
  });

  return (
    <View>
      <ChartDateNavigator
        dateText={dateText}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        currentDate={currentDate}
        chartType="week"
      />
      {isLoading || !data ? (
        <ChartSkeleton />
      ) : (
        <BarChart
          data={data}
          barBorderRadius={4}
          barWidth={22}
          hideRules
          isAnimated
          showFractionalValues
          showYAxisIndices
          noOfSections={4}
          xAxisThickness={0}
          yAxisThickness={0}
        />
      )}
    </View>
  );
};

export default React.memo(WeeklyChart);
