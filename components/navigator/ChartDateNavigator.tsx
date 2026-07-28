import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Pressable, View } from "react-native";

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
  const isCurrentPeriod = currentDate.isSame(dayjs(), chartType);

  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-3 py-2">
      <Pressable
        onPress={onPrev}
        className="h-9 w-9 items-center justify-center rounded-full bg-white"
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      >
        <Ionicons name="chevron-back" size={20} color="#0D0F1B" />
      </Pressable>

      <Text className="text-sm font-semibold text-[#0D0F1B]">{dateText}</Text>

      {isCurrentPeriod ? (
        <View className="h-9 w-9 items-center justify-center opacity-30">
          <Ionicons name="chevron-forward" size={20} color="#0D0F1B" />
        </View>
      ) : (
        <Pressable
          onPress={onNext}
          className="h-9 w-9 items-center justify-center rounded-full bg-white"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Ionicons name="chevron-forward" size={20} color="#0D0F1B" />
        </Pressable>
      )}
    </View>
  );
};

export default ChartDateNavigator;
