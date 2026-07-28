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
      className="flex-row items-center rounded-2xl bg-[#F7F7F7] px-4 py-3 active:opacity-80"
    >
      <View
        className="mr-3 rounded-full px-2.5 py-1"
        style={{ backgroundColor: theme.bg }}
      >
        <Text className="text-xs font-semibold" style={{ color: theme.color }}>
          {theme.label}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-[#0D0F1B]">
          {record.amount}g
        </Text>
        {record.memo ? (
          <Text className="mt-0.5 text-xs text-gray-500">{record.memo}</Text>
        ) : null}
      </View>
      <Text className="text-xs text-gray-400">수정</Text>
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
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-center text-sm text-gray-400">
          날짜를 선택하세요
        </Text>
      </View>
    );
  }

  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm">
      <Text className="mb-3 text-sm font-semibold text-[#0D0F1B]">
        {formattedDate}
      </Text>

      {marker ? (
        <HStack className="mb-4 gap-2">
          {marker.hasFood ? (
            <View
              className="rounded-xl px-3 py-2"
              style={{ backgroundColor: DIET_MEAL_COLORS.food.bg }}
            >
              <Text
                style={{ color: DIET_MEAL_COLORS.food.color }}
                className="text-xs font-semibold"
              >
                사료 {marker.foodAmount}g
              </Text>
            </View>
          ) : null}
          {marker.hasSnack ? (
            <View
              className="rounded-xl px-3 py-2"
              style={{ backgroundColor: DIET_MEAL_COLORS.snack.bg }}
            >
              <Text
                style={{ color: DIET_MEAL_COLORS.snack.color }}
                className="text-xs font-semibold"
              >
                간식 {marker.snackAmount}g
              </Text>
            </View>
          ) : null}
        </HStack>
      ) : null}

      {records.length === 0 ? (
        <View className="items-center py-6">
          <Text className="text-2xl">🍽️</Text>
          <Text className="mt-2 text-sm text-gray-500">
            이 날의 식단 기록이 없어요
          </Text>
          <Text className="mt-1 text-xs text-gray-400">
            아래 버튼으로 사료·간식을 추가해 보세요
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {records.map((record) => (
            <DietRecordRow
              key={record.id}
              record={record}
              onPress={onPressRecord}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default DietSelectedDayPanel;
