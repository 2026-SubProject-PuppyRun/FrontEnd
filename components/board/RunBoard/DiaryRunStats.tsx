import { useRunStore } from "@/store/useRunStore";
import { getRunResultStats } from "@/util/run/getRunResultStats";
import React from "react";
import { Text, View } from "react-native";

/** 다이어리용 — 작성 흐름을 방해하지 않는 컴팩트 스탯 */
const DiaryRunStats = () => {
  const runData = useRunStore((state) => state.runData);
  const { distanceKm, totalTimeLabel, paceLabel } = getRunResultStats(runData);

  return (
    <View className="mx-6 mb-2 mt-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold italic text-primary-500">
            {paceLabel}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold text-primary-400">
            Avg Pace
          </Text>
        </View>
        <View className="h-8 w-px bg-outline-200" />
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold italic text-primary-500">
            {distanceKm}km
          </Text>
          <Text className="mt-0.5 text-xs font-semibold text-primary-400">
            Distance
          </Text>
        </View>
        <View className="h-8 w-px bg-outline-200" />
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold italic text-primary-500">
            {totalTimeLabel}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold text-primary-400">
            Time
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DiaryRunStats;
