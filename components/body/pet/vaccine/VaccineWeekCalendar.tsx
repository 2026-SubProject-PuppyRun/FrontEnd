import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { useVaccineStore } from "@/store/useVaccineStore";
import { VaccineRecord } from "@/types/vaccine";
import { Ionicons } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type DaySchedule = {
  date: string;
  day: number;
  isToday: boolean;
  records: VaccineRecord[];
};

const buildWeekDays = (
  weekStart: Dayjs,
  records: VaccineRecord[],
): DaySchedule[] => {
  const today = dayjs().startOf("day");
  const byDate = records.reduce<Record<string, VaccineRecord[]>>((acc, record) => {
    const key = dayjs(record.nextVaccinationAt).format("YYYY-MM-DD");
    (acc[key] ??= []).push(record);
    return acc;
  }, {});

  return Array.from({ length: 7 }, (_, index) => {
    const date = weekStart.add(index, "day");
    const key = date.format("YYYY-MM-DD");
    return {
      date: key,
      day: date.date(),
      isToday: date.isSame(today, "day"),
      records: byDate[key] ?? [],
    };
  });
};

const VaccineWeekCalendar = () => {
  const router = useRouter();
  const records = useVaccineStore((state) => state.records);
  const petList = usePetStore((state) => state.petList);

  const [weekStart, setWeekStart] = useState(() =>
    dayjs().startOf("week"), // Sunday
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );

  const weekDays = useMemo(
    () => buildWeekDays(weekStart, records),
    [weekStart, records],
  );

  const selectedDay = weekDays.find((day) => day.date === selectedDate);
  const selectedRecords = selectedDay?.records ?? [];
  const currentWeekStart = dayjs().startOf("week");
  const isCurrentWeek = weekStart.isSame(currentWeekStart, "day");
  const weekLabel = `${weekStart.format("M/D")} – ${weekStart.add(6, "day").format("M/D")}`;
  const selectedLabel = dayjs(selectedDate).locale("ko").format("M월 D일 (ddd)");
  const today = dayjs().startOf("day");

  const petNameById = useMemo(() => {
    const map = new Map<string, string>();
    petList?.forEach((pet) => map.set(pet.petId, pet.name));
    return map;
  }, [petList]);

  const syncSelectedDate = (nextStart: Dayjs) => {
    const weekEnd = nextStart.add(6, "day");
    const selected = dayjs(selectedDate);
    if (selected.isBefore(nextStart, "day") || selected.isAfter(weekEnd, "day")) {
      const todayKey = dayjs().format("YYYY-MM-DD");
      const todayInWeek =
        !dayjs(todayKey).isBefore(nextStart, "day") &&
        !dayjs(todayKey).isAfter(weekEnd, "day");
      setSelectedDate(todayInWeek ? todayKey : nextStart.format("YYYY-MM-DD"));
    }
  };

  const handlePrevWeek = () => {
    const nextStart = weekStart.subtract(1, "week");
    setWeekStart(nextStart);
    syncSelectedDate(nextStart);
  };

  const handleNextWeek = () => {
    const nextStart = weekStart.add(1, "week");
    setWeekStart(nextStart);
    syncSelectedDate(nextStart);
  };

  const handleGoThisWeek = () => {
    setWeekStart(currentWeekStart);
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold text-[#0D0F1B]">접종 일정</Text>
          <Text className="mt-0.5 text-xs text-gray-500">{weekLabel}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          {!isCurrentWeek ? (
            <Pressable
              onPress={handleGoThisWeek}
              accessibilityRole="button"
              accessibilityLabel="이번 주로 이동"
              className="mr-1 rounded-full bg-[#FFF0F0] px-2.5 py-1"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-[11px] font-semibold text-[#F25857]">
                이번 주
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={handlePrevWeek}
            accessibilityRole="button"
            accessibilityLabel="이전 주"
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F7]"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Ionicons name="chevron-back" size={18} color="#0D0F1B" />
          </Pressable>
          <Pressable
            onPress={handleNextWeek}
            accessibilityRole="button"
            accessibilityLabel="다음 주"
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F7]"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Ionicons name="chevron-forward" size={18} color="#0D0F1B" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row">
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} className="flex-1 items-center pb-1">
            <Text
              className={`text-[11px] font-semibold ${
                index === 0
                  ? "text-[#F25857]"
                  : index === 6
                    ? "text-[#2563EB]"
                    : "text-gray-400"
              }`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row">
        {weekDays.map((day, index) => {
          const isSelected = day.date === selectedDate;
          const hasSchedule = day.records.length > 0;
          const hasOverdue = day.records.some((record) =>
            dayjs(record.nextVaccinationAt).isBefore(today),
          );
          const dayTextColor = isSelected
            ? "text-white"
            : day.isToday
              ? "text-[#F25857]"
              : index === 0
                ? "text-[#F25857]"
                : index === 6
                  ? "text-[#2563EB]"
                  : "text-[#0D0F1B]";

          return (
            <Pressable
              key={day.date}
              onPress={() => handleSelectDate(day.date)}
              accessibilityRole="button"
              accessibilityLabel={`${day.day}일 접종 일정`}
              className="flex-1 items-center py-1"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isSelected
                    ? "bg-[#F25857]"
                    : day.isToday
                      ? "border-2 border-[#F25857]"
                      : ""
                }`}
              >
                <Text className={`text-sm font-semibold ${dayTextColor}`}>
                  {day.day}
                </Text>
              </View>
              <View className="mt-1 h-1.5 items-center justify-center">
                {hasSchedule ? (
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: hasOverdue ? "#F25857" : "#F59E0B",
                    }}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3 border-t border-[#F7F7F7] pt-3">
        <Text className="mb-2 text-xs font-semibold text-gray-500">
          {selectedLabel}
        </Text>

        {selectedRecords.length === 0 ? (
          <Text className="text-sm text-gray-400">예정된 접종이 없어요</Text>
        ) : (
          <View className="gap-2">
            {selectedRecords.map((record) => {
              const isOverdue = dayjs(record.nextVaccinationAt).isBefore(today);
              const petName = petNameById.get(record.petId) ?? "반려견";

              return (
                <Pressable
                  key={record.id}
                  onPress={() =>
                    router.push(`/care/pets/${record.petId}/vaccine`)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${petName} ${record.name} 접종 상세`}
                  className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-3 py-2.5"
                  style={({ pressed }) =>
                    pressed ? { opacity: 0.85 } : undefined
                  }
                >
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#0D0F1B]">
                      {petName} · {record.name}
                    </Text>
                    <Text
                      className={`mt-0.5 text-xs ${
                        isOverdue ? "text-[#F25857]" : "text-gray-500"
                      }`}
                    >
                      {isOverdue ? "접종일이 지났어요" : "접종 예정"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default VaccineWeekCalendar;
