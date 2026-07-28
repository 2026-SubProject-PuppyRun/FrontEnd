import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

const dummyData: Record<string, number> = {
  "2026-03-16": 2,
  "2026-03-17": 4,
  "2026-03-18": 1,
  "2026-03-19": 3,
  "2026-03-20": 1,
  "2026-03-22": 2,
  "2026-03-23": 5,
  "2026-03-24": 4,
};

const getColorByCount = (count: number) => {
  if (count === 0) return "bg-[#F3F4F6]";
  if (count === 1) return "bg-[#FFD6D6]";
  if (count === 2) return "bg-[#FF9E9D]";
  if (count >= 3) return "bg-[#F25857]";
  return "bg-[#F3F4F6]";
};

const GrassChart = () => {
  const days = useMemo(() => {
    const today = dayjs();
    const result = [];
    for (let i = 160; i >= 0; i--) {
      const targetDate = today.subtract(i, "day");
      result.push(targetDate.format("YYYY-MM-DD"));
    }
    return result;
  }, []);

  const weeks = useMemo(() => {
    const chunked = [];
    for (let i = 0; i < days.length; i += 7) {
      chunked.push(days.slice(i, i + 7));
    }
    return chunked;
  }, [days]);

  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-1">
          {weeks.map((week, weekIndex) => {
            const currentMonth = dayjs(week[0]).format("M월");
            const prevMonth =
              weekIndex > 0
                ? dayjs(weeks[weekIndex - 1][0]).format("M월")
                : null;
            const showMonth = currentMonth !== prevMonth;

            return (
              <View key={weekIndex} className="w-3 gap-1">
                <View className="relative h-6 w-3">
                  {showMonth && (
                    <Text className="absolute -left-0 w-10 text-xs text-gray-500">
                      {currentMonth}
                    </Text>
                  )}
                </View>

                {week.map((date) => {
                  const count = dummyData[date] || 0;
                  return (
                    <View
                      key={date}
                      className={`h-3 w-3 rounded-sm ${getColorByCount(count)}`}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className="mt-4 flex-row items-center justify-end gap-2">
        <Text className="text-xs text-gray-500">적음</Text>
        <View className="h-3 w-3 rounded-sm bg-[#F3F4F6]" />
        <View className="h-3 w-3 rounded-sm bg-[#FFD6D6]" />
        <View className="h-3 w-3 rounded-sm bg-[#FF9E9D]" />
        <View className="h-3 w-3 rounded-sm bg-[#F25857]" />
        <Text className="text-xs text-gray-500">많음</Text>
      </View>
    </View>
  );
};

export default GrassChart;
