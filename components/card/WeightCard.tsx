import { Text } from "@/components/ui/text";
import { WeightRecord } from "@/types/weight";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Pressable, View } from "react-native";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatMeasuredDate = (dateStr: string) => {
  const d = dayjs(dateStr).locale("ko");
  return `${d.format("M월 D일")} (${WEEKDAY_KO[d.day()]})`;
};

interface WeightCardProps {
  record: WeightRecord;
  selected?: boolean;
  onPress?: () => void;
}

const WeightCard = ({ record, selected, onPress }: WeightCardProps) => (
  <Pressable
    onPress={onPress}
    className={`rounded-2xl px-4 py-3 active:opacity-80 ${
      selected
        ? "border-2 border-[#F25857] bg-[#FFF5F5]"
        : "border border-gray-100 bg-white shadow-sm"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-semibold text-[#0D0F1B]">
        {record.weight}kg
      </Text>
      <Text className="text-xs text-gray-500">
        {formatMeasuredDate(record.measuredAt)}
      </Text>
    </View>
    {record.memo ? (
      <Text className="mt-2 text-sm text-gray-500">{record.memo}</Text>
    ) : null}
  </Pressable>
);

export default WeightCard;
