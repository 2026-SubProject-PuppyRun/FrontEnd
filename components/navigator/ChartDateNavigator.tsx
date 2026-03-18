import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChartDateNavigatorProps {
  dateText: string;
  currentDate: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
  chartType: "week" | "month" | "year";
}

const ChartDateNavigator: React.FC<ChartDateNavigatorProps> = ({
  onPrev,
  onNext,
  dateText,
  currentDate,
  chartType,
}) => {
  return (
    <View className="mx-10 mb-4 flex-row items-center justify-between">
      <TouchableOpacity onPress={onPrev}>
        <Ionicons name="caret-back" size={24} color="black" />
      </TouchableOpacity>
      <Text>{dateText}</Text>
      {currentDate.isSame(dayjs(), chartType) ? (
        <View className="opacity-30">
          <Ionicons name="caret-forward" size={24} color="black" />
        </View>
      ) : (
        <TouchableOpacity onPress={onNext}>
          <Ionicons name="caret-forward" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChartDateNavigator;
