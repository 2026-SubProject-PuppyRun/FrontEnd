import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useRef } from "react";
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
  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const monthKey = currentDate.format("YYYY-MM");
  const { data, isLoading } = useQuery({
    queryKey: ["monthlyData", monthKey],
    queryFn: async () => {
      console.log("fetching monthly data for", monthKey);
      return MonthlyData;
    },
  });

  return (
    <View>
      <ChartDateNavigator
        dateText={`${currentDate.year()}년 ${currentDate.month() + 1}월`}
        currentDate={currentDate}
        onPrev={() => setCurrentDate((prev) => prev.subtract(1, "month"))}
        onNext={() => setCurrentDate((prev) => prev.add(1, "month"))}
        chartType="month"
      />
      {isLoading || !data ? (
        <ChartSkeleton />
      ) : (
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
      )}
    </View>
  );
};

export default React.memo(MonthlyChart);
