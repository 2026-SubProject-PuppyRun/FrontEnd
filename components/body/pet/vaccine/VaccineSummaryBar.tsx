import { Text } from "@/components/ui/text";
import { VaccineRecord } from "@/types/vaccine";
import dayjs from "dayjs";
import { View } from "react-native";

interface VaccineSummaryBarProps {
  records: VaccineRecord[];
}

const VaccineSummaryBar = ({ records }: VaccineSummaryBarProps) => {
  const today = dayjs().startOf("day");

  const upcoming = records
    .map((record) => ({
      record,
      nextDate: dayjs(record.nextVaccinationAt),
    }))
    .filter(({ nextDate }) => nextDate.isAfter(today) || nextDate.isSame(today))
    .sort((a, b) => a.nextDate.valueOf() - b.nextDate.valueOf());

  const overdueCount = records.filter(({ nextVaccinationAt }) =>
    dayjs(nextVaccinationAt).isBefore(today),
  ).length;

  const nextVaccine = upcoming[0];

  return (
    <View className="mb-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
      <Text className="text-sm text-gray-500">다음 접종</Text>
      {nextVaccine ? (
        <>
          <Text className="mt-1 text-xl font-bold text-[#0D0F1B]">
            {nextVaccine.record.name}
          </Text>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              {nextVaccine.nextDate.format("M월 D일")}
            </Text>
            <View
              className="rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  nextVaccine.nextDate.diff(today, "day") <= 14
                    ? "#FEF3C7"
                    : "#EFF6FF",
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{
                  color:
                    nextVaccine.nextDate.diff(today, "day") <= 14
                      ? "#D97706"
                      : "#2563EB",
                }}
              >
                {nextVaccine.nextDate.isSame(today, "day")
                  ? "오늘"
                  : `D-${nextVaccine.nextDate.diff(today, "day")}`}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text className="mt-1 text-base font-medium text-gray-400">
          예정된 접종이 없어요
        </Text>
      )}

      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <Text className="text-xs text-gray-500">총 {records.length}건</Text>
        {overdueCount > 0 ? (
          <Text className="text-xs font-semibold text-[#F25857]">
            지난 접종 {overdueCount}건
          </Text>
        ) : (
          <Text className="text-xs text-gray-400">일정을 잘 지키고 있어요</Text>
        )}
      </View>
    </View>
  );
};

export default VaccineSummaryBar;
