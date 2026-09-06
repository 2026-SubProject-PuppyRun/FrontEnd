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
  <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
    <View className="flex-row items-end justify-between">
      <View>
        <Text className="text-sm text-gray-500">현재 체중</Text>
        <Text className="mt-1 text-3xl font-bold text-[#0D0F1B]">
          {summary.currentWeight != null ? `${summary.currentWeight}kg` : "-"}
        </Text>
      </View>
      {summary.previousDelta != null ? (
        <Text
          className="text-sm font-medium"
          style={{
            color:
              summary.previousDelta > 0
                ? "#EA580C"
                : summary.previousDelta < 0
                  ? "#2563EB"
                  : "#6B7280",
          }}
        >
          직전 대비 {formatDelta(summary.previousDelta)}
        </Text>
      ) : null}
    </View>

    <View className="mt-4 flex-row items-center justify-between">
      <View
        className="rounded-full px-3 py-1.5"
        style={{ backgroundColor: `${summary.statusColor}20` }}
      >
        <Text
          style={{ color: summary.statusColor }}
          className="text-xs font-semibold"
        >
          {summary.statusLabel}
        </Text>
      </View>
      {summary.breedRangeLabel ? (
        <Text className="text-xs text-gray-500">
          견종 기준 {summary.breedRangeLabel}kg
        </Text>
      ) : null}
    </View>
  </View>
);

export default WeightSummaryBar;
