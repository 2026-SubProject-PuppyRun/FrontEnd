import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface WeeklyChartProps {
  data: {
    label: string;
    value: number;
  }[];
}

const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <View>
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
