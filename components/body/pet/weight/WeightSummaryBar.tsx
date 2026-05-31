import { Text } from "@/components/ui/text";
import { WeightSummary } from "@/types/weight";
import { View } from "react-native";

interface WeightSummaryBarProps {
  summary: WeightSummary;
}

const formatDelta = (delta: number) => {
  if (delta > 0) return `+${delta.toFixed(1)}kg`;
  if (delta < 0) return `${delta.toFixed(1)}kg`;
  return "±0.0kg";
};

const WeightSummaryBar = ({ summary }: WeightSummaryBarProps) => (
  <View className="mx-4 mt-4 rounded-2xl bg-gray-50 px-4 py-4">
    <View className="flex-row items-end justify-between">
      <View>
        <Text className="text-sm text-gray-500">현재 체중</Text>
        <Text className="mt-1 text-3xl font-bold text-[#0D0F1B]">
          {summary.currentWeight != null ? `${summary.currentWeight}kg` : "-"}
        </Text>
      </View>
      {summary.previousDelta != null ? (
        <Text className="text-sm font-medium text-gray-600">
          직전 대비 {formatDelta(summary.previousDelta)}
        </Text>
      ) : null}
    </View>

    <View className="mt-3 flex-row items-center justify-between">
      <View
        className="rounded-full px-3 py-1"
        style={{ backgroundColor: `${summary.statusColor}20` }}
      >
        <Text style={{ color: summary.statusColor }} className="text-sm font-semibold">
          {summary.statusLabel}
        </Text>
      </View>
      {summary.breedRangeLabel ? (
        <Text className="text-sm text-gray-500">
          견종 기준 {summary.breedRangeLabel}kg
        </Text>
      ) : null}
    </View>
  </View>
);

export default WeightSummaryBar;
