import { Text } from "@/components/ui/text";
import { WeightChartPoint, WeightRecord } from "@/types/weight";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface WeightChartProps {
  chartPoints: WeightChartPoint[];
  selectedRecordId: string | null;
  onSelectRecord: (record: WeightRecord) => void;
  records: WeightRecord[];
}

const WeightChart = ({
  chartPoints,
  selectedRecordId,
  onSelectRecord,
  records,
}: WeightChartProps) => {
  if (chartPoints.length === 0) {
    return (
      <View className="mx-4 mt-4 min-h-[220px] items-center justify-center rounded-2xl bg-gray-50">
        <Text className="text-sm text-gray-500">
          선택한 기간에 표시할 체중 기록이 없어요
        </Text>
      </View>
    );
  }

  const recordMap = new Map(records.map((record) => [record.id, record]));

  const data = chartPoints.map((point) => {
    const selected = point.recordId === selectedRecordId;
    return {
      value: point.value,
      label: point.label,
      dataPointColor: selected ? "#F97316" : "#9CA3AF",
      dataPointRadius: selected ? 8 : 5.5,
      onPress: () => {
        const record = recordMap.get(point.recordId);
        if (record) onSelectRecord(record);
      },
    };
  });

  const values = chartPoints.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yAxisOffset = Math.max(0, minValue - 0.5);
  const chartMax = maxValue + 0.5;
  const chartKey = chartPoints
    .map((point) => `${point.recordId}:${point.value}:${point.measuredAt}`)
    .join("|");

  return (
    <View className="mx-4 mt-4 min-h-[220px] rounded-2xl bg-gray-50 px-2 py-4">
      <LineChart
        key={chartKey}
        data={data}
        hideRules
        isAnimated
        showFractionalValues
        noOfSections={4}
        maxValue={chartMax - yAxisOffset}
        yAxisOffset={yAxisOffset}
        spacing={chartPoints.length > 1 ? 48 : 0}
        initialSpacing={20}
        endSpacing={20}
        xAxisThickness={0}
        yAxisThickness={0}
        color="#F97316"
        thickness={2}
        areaChart
        startFillColor="#F97316"
        endFillColor="#F97316"
        startOpacity={0.15}
        endOpacity={0.02}
      />
      <Text className="mt-2 text-center text-xs text-gray-400">
        그래프의 점을 눌러 기록을 확인하세요
      </Text>
    </View>
  );
};

export default WeightChart;
