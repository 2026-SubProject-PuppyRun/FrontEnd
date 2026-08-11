import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import {
  resolveDogColor,
  useWeeklyStatisticsQuery,
} from "@/util/api/activity-tracking";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type CompareChartProps = {
  referenceDate: Dayjs;
};

const CompareChart = ({ referenceDate }: CompareChartProps) => {
  const knownPetCount = usePetStore(
    (state) => state.totalPetCount ?? state.petList?.length,
  );
  const { data, isLoading } = useWeeklyStatisticsQuery(referenceDate);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const apiDogCount =
    data?.family_report.total_dogs ?? data?.family_report.dog_stats.length ?? 0;

  const chartData = useMemo(() => {
    if (!data?.family_report.dog_stats.length) return [];

    return data.family_report.dog_stats.map((dog, index) => ({
      value: dog.share_percentage,
      label: dog.name,
      color: resolveDogColor(dog.theme_color, index),
    }));
  }, [data]);

  if (
    (knownPetCount != null && knownPetCount <= 1) ||
    (!isLoading && apiDogCount <= 1)
  ) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
          반려견별 산책 비율
        </Text>
        <View className="rounded-3xl bg-white p-5 shadow-sm">
          <ChartSkeleton />
        </View>
      </>
    );
  }

  if (!chartData.length) {
    return (
      <>
        <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
          반려견별 산책 비율
        </Text>
        <View className="rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-center text-sm text-gray-500">
            이번 주 반려견 산책 기록이 없어요.
          </Text>
        </View>
      </>
    );
  }

  const selectedItem = chartData[selectedIndex] ?? chartData[0];
  const periodLabel = data
    ? `${dayjs(data.period.start_date).format("M/D")} ~ ${dayjs(data.period.end_date).format("M/D")}`
    : "";

  return (
    <>
      <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
        반려견별 산책 비율
      </Text>
      <View className="rounded-3xl bg-white p-5 shadow-sm">
      {periodLabel ? (
        <Text className="mb-3 text-xs text-gray-500">{periodLabel}</Text>
      ) : null}

      <View className="flex-row items-center justify-center">
        <PieChart
          data={chartData}
          donut
          sectionAutoFocus
          radius={88}
          innerRadius={58}
          innerCircleColor="#FFFFFF"
          focusOnPress
          toggleFocusOnPress={false}
          onPress={(_item, index) => setSelectedIndex(index)}
          selectedIndex={selectedIndex}
          centerLabelComponent={() => (
            <View className="items-center justify-center">
              <Text className="text-xl font-bold text-[#0D0F1B]">
                {Math.round(selectedItem.value)}%
              </Text>
              <Text className="text-sm text-gray-500">{selectedItem.label}</Text>
            </View>
          )}
        />
        <View className="ml-4 gap-3">
          {chartData.map((item, index) => (
            <View key={item.label} className="flex-row items-center">
              <View
                style={{ backgroundColor: item.color }}
                className="mr-2.5 h-3.5 w-3.5 rounded-full"
              />
              <Text
                className={`text-sm ${
                  selectedIndex === index
                    ? "font-bold text-[#0D0F1B]"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
    </>
  );
};

export default CompareChart;
