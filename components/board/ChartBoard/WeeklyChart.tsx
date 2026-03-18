import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import { Spinner } from "@/components/ui/spinner";
import { getWeekName } from "@/util/getWeekOfMonth";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
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
  const [data, setData] = useState(WeeklyData);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const year = currentDate.year();
  const month = currentDate.month() + 1;
  const weekName = getWeekName(currentDate);
  const dateText = `${year}년 ${month}월 ${weekName} 주`;

  const handlePrevWeek = () => {
    setCurrentDate((prev) => prev.subtract(1, "week"));
  };
  const handleNextWeek = () => {
    setCurrentDate((prev) => prev.add(1, "week"));
  };
  useEffect(() => {
    const fetchData = async () => {
      setData(WeeklyData);
    };
    fetchData();
  }, []);

  if (!data)
    return (
      <View className="mb-6 flex-1 items-center justify-center">
        <Spinner size="large" color="#BFB8AA" />
      </View>
    );
  return (
    <View>
      <ChartDateNavigator
        dateText={dateText}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        currentDate={currentDate}
        chartType="week"
      />
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
    </View>
  );
};

export default React.memo(WeeklyChart);
