import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import { Spinner } from "@/components/ui/spinner";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const YearlyData: { label: string; value: number }[] = [
  { label: "2020", value: 1000 },
  { label: "2021", value: 2000 },
  { label: "2022", value: 3000 },
  { label: "2023", value: 4000 },
];
const YearlyChart = () => {
  const [data, setData] = React.useState(YearlyData);
  const [currentDate, setCurrentDate] = React.useState(dayjs());
  useEffect(() => {
    const fetchData = async () => {
      setData(YearlyData);
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
        dateText={`${currentDate.year()}년`}
        currentDate={currentDate}
        onPrev={() => setCurrentDate((prev) => prev.subtract(1, "year"))}
        onNext={() => setCurrentDate((prev) => prev.add(1, "year"))}
        chartType="year"
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

export default React.memo(YearlyChart);
