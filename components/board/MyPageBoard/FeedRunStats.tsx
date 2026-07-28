import { formatTime } from "@/util/run/formatTime";
import React from "react";
import { Text, View } from "react-native";

interface FeedRunStatsProps {
  pace: string;
  distance: number;
  duration: number;
}

/** 피드 상세용 — 저장된 산책 기록 스탯 */
const FeedRunStats = ({ pace, distance, duration }: FeedRunStatsProps) => (
  <View className="mx-6 mb-2 mt-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
    <View className="flex-row items-center justify-between">
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold italic text-primary-500">{pace}</Text>
        <Text className="mt-0.5 text-xs font-semibold text-primary-400">Pace</Text>
      </View>
      <View className="h-8 w-px bg-outline-200" />
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold italic text-primary-500">
          {(distance / 1000).toFixed(2)}km
        </Text>
        <Text className="mt-0.5 text-xs font-semibold text-primary-400">
          Distance
        </Text>
      </View>
      <View className="h-8 w-px bg-outline-200" />
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold italic text-primary-500">
          {formatTime(duration)}
        </Text>
        <Text className="mt-0.5 text-xs font-semibold text-primary-400">Time</Text>
      </View>
    </View>
  </View>
);

export default FeedRunStats;
