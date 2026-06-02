import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import { DietDayMarker, DietRecord } from "@/types/diet";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { View } from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/ko";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatSelectedDate = (date: string) => {
  const d = dayjs(date).locale("ko");
  return `${d.format("M월 D일")} (${WEEKDAY_KO[d.day()]})`;
};

interface DietRecordRowProps {
  record: DietRecord;
  onPress: (record: DietRecord) => void;
}

const DietRecordRow = ({ record, onPress }: DietRecordRowProps) => {
  const theme = DIET_MEAL_COLORS[record.type];

  return (
    <Pressable
      onPress={() => onPress(record)}
      className="flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 active:opacity-80"
    >
      <View
        className="mr-3 h-3 w-3 rounded-full"
        style={{ backgroundColor: theme.color }}
      />
      <View className="flex-1">
        <Text className="text-base font-medium text-[#0D0F1B]">
          {theme.label} · {record.amount}g
        </Text>
        {record.memo ? (
          <Text className="mt-0.5 text-sm text-gray-500">{record.memo}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

interface DietSelectedDayPanelProps {
  selectedDate: string | null;
  marker?: DietDayMarker;
  records: DietRecord[];
  onPressRecord: (record: DietRecord) => void;
}

const DietSelectedDayPanel = ({
  selectedDate,
  marker,
  records,
  onPressRecord,
}: DietSelectedDayPanelProps) => {
  if (!selectedDate) {
    return (
      <View className="px-4 py-6">
        <Text className="text-center text-gray-400">날짜를 선택하세요</Text>
      </View>
    );
  }

  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <View className="border-t border-gray-100 px-4 py-4">
      <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
        {formattedDate}
      </Text>

      {marker ? (
        <HStack className="mb-4 gap-3">
          {marker.hasFood ? (
            <View
              className="rounded-xl px-3 py-2"
              style={{ backgroundColor: DIET_MEAL_COLORS.food.bg }}
            >
              <Text style={{ color: DIET_MEAL_COLORS.food.color }} className="text-sm font-medium">
                사료 {marker.foodAmount}g
              </Text>
            </View>
          ) : null}
          {marker.hasSnack ? (
            <View
              className="rounded-xl px-3 py-2"
              style={{ backgroundColor: DIET_MEAL_COLORS.snack.bg }}
            >
              <Text style={{ color: DIET_MEAL_COLORS.snack.color }} className="text-sm font-medium">
                간식 {marker.snackAmount}g
              </Text>
            </View>
          ) : null}
        </HStack>
      ) : null}

      {records.length === 0 ? (
        <Text className="text-sm text-gray-400">기록이 없습니다.</Text>
      ) : (
        <View className="gap-2">
          {records.map((record) => (
            <DietRecordRow key={record.id} record={record} onPress={onPressRecord} />
          ))}
        </View>
      )}
    </View>
  );
};

export default DietSelectedDayPanel;
