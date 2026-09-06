import React from "react";
import { Text, View } from "react-native";

interface ChartFormatProps {
  chartValues: {
    label: string;
    value: number;
  }[];
  highlightValue?: string;
}

const ChartFormat = () => {
  return (
    <View>
      <Text>ChartFormat</Text>
    </View>
  );
};

export default ChartFormat;
