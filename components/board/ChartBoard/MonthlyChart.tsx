import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import { Spinner } from "@/components/ui/spinner";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MonthlyData: { label: string; value: number }[] = [
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
];

const MonthlyChart = () => {
  const ref = useRef(null);
  const [data, setData] = React.useState(MonthlyData);
  const [currentDate, setCurrentDate] = React.useState(dayjs());
  useEffect(() => {
    const fetchData = async () => {
      setData(MonthlyData);
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
        dateText={`${currentDate.year()}년 ${currentDate.month() + 1}월`}
        currentDate={currentDate}
        onPrev={() => setCurrentDate((prev) => prev.subtract(1, "month"))}
        onNext={() => setCurrentDate((prev) => prev.add(1, "month"))}
        chartType="month"
      />
      <LineChart
        scrollRef={ref}
        data={data}
        hideRules
        isAnimated
        showFractionalValues
        showYAxisIndices
        noOfSections={4}
        xAxisThickness={0}
        yAxisThickness={0}
        curved
      />
    </View>
  );
};

export default React.memo(MonthlyChart);
