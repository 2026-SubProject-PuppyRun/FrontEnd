import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { WeightRecord } from "@/types/weight";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { View } from "react-native";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatMeasuredDate = (dateStr: string) => {
  const d = dayjs(dateStr).locale("ko");
  return `${d.format("M월 D일")} (${WEEKDAY_KO[d.day()]})`;
};

interface WeightSelectedPanelProps {
  record: WeightRecord | null;
}

const WeightSelectedPanel = ({ record }: WeightSelectedPanelProps) => {
  if (!record) return null;

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm">
      <Text className="mb-2 text-xs font-semibold text-gray-500">
        선택한 기록
      </Text>
      <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
        <Text className="text-xl font-bold text-[#0D0F1B]">
          {record.weight}kg
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          {formatMeasuredDate(record.measuredAt)}
        </Text>
      </View>
    </View>
  );
};

export default WeightSelectedPanel;
