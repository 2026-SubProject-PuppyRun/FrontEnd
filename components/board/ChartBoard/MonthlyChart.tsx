import React, { useRef } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface MonthlyChartProps {
  data: {
    label: string;
    value: number;
  }[];
}
const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const ref = useRef(null);

  return (
    <View>
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

export default MonthlyChart;
