import { Text } from "@/components/ui/text";
import { VaccineRecord } from "@/types/vaccine";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Pressable, View } from "react-native";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatDate = (dateStr: string) => {
  const d = dayjs(dateStr).locale("ko");
  return `${d.format("M월 D일")} (${WEEKDAY_KO[d.day()]})`;
};

const getNextStatus = (nextVaccinationAt: string) => {
  const today = dayjs().startOf("day");
  const next = dayjs(nextVaccinationAt).startOf("day");
  const diff = next.diff(today, "day");

  if (diff < 0) {
    return { label: "지남", bg: "#FEE2E2", color: "#F25857" };
  }
  if (diff === 0) {
    return { label: "오늘", bg: "#FEF3C7", color: "#D97706" };
  }
  if (diff <= 14) {
    return { label: `D-${diff}`, bg: "#FEF3C7", color: "#D97706" };
  }
  return { label: "예정", bg: "#EFF6FF", color: "#2563EB" };
};

interface VaccineCardProps {
  record: VaccineRecord;
  onPress?: () => void;
}

const VaccineCard = ({ record, onPress }: VaccineCardProps) => {
  const status = getNextStatus(record.nextVaccinationAt);

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 text-base font-semibold text-[#0D0F1B]">
          {record.name}
        </Text>
        <View
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: status.bg }}
        >
          <Text className="text-xs font-semibold" style={{ color: status.color }}>
            {status.label}
          </Text>
        </View>
      </View>

      <View className="mt-3 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">접종일</Text>
          <Text className="text-sm text-[#0D0F1B]">
            {formatDate(record.vaccinatedAt)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">다음 접종</Text>
          <Text className="text-sm text-[#0D0F1B]">
            {formatDate(record.nextVaccinationAt)}
          </Text>
        </View>
      </View>

      {record.memo ? (
        <Text className="mt-2 text-sm text-gray-500">{record.memo}</Text>
      ) : null}
    </Pressable>
  );
};

export default VaccineCard;
