import { Text } from "@/components/ui/text";
import type { DailyStatisticsResponse } from "@/util/api/activity-tracking";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";

type WeeklyDaySummaryProps = {
  date: string;
  data?: DailyStatisticsResponse;
  isLoading: boolean;
  isError: boolean;
};

const WeeklyDaySummary = ({
  date,
  data,
  isLoading,
  isError,
}: WeeklyDaySummaryProps) => {
  const dateLabel = dayjs(date).locale("ko").format("M월 D일 (ddd)");

  if (isLoading) {
    return (
      <View className="mt-6 items-center rounded-2xl bg-[#F7F7F7] py-10">
        <ActivityIndicator color="#F25857" />
        <Text className="mt-2 text-sm text-gray-500">{dateLabel} 불러오는 중</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="mt-6 rounded-2xl bg-[#F7F7F7] p-4">
        <Text className="text-sm font-semibold text-[#0D0F1B]">{dateLabel}</Text>
        <Text className="mt-1 text-sm text-gray-500">
          일간 산책 기록을 불러오지 못했어요.
        </Text>
      </View>
    );
  }

  if (!data || data.summary.walk_count === 0) {
    return (
      <View className="mt-6 rounded-2xl bg-[#F7F7F7] p-4">
        <Text className="text-sm font-semibold text-[#0D0F1B]">{dateLabel}</Text>
        <Text className="mt-1 text-sm text-gray-500">
          이 날은 산책 기록이 없어요.
        </Text>
      </View>
    );
  }

  const { summary, tracking } = data;

  return (
    <View className="mt-6 gap-3">
      <View className="rounded-2xl bg-[#FFF3F3] p-4">
        <Text className="text-sm font-semibold text-[#0D0F1B]">{dateLabel}</Text>
        <Text className="mt-2 text-base font-bold text-[#F25857]">
          {summary.total_distance_km} km · {summary.total_duration_min}분 ·{" "}
          {summary.walk_count}회
        </Text>
      </View>

      {tracking.map((item) => (
        <View
          key={item.tracking_id}
          className="rounded-2xl bg-[#F7F7F7] p-4"
        >
          <View className="flex-row flex-wrap gap-2">
            {item.participating_pets.map((pet) => (
              <View
                key={pet.pet_id}
                className="flex-row items-center rounded-full bg-white px-2 py-1"
              >
                {pet.profile_image_url ? (
                  <Image
                    source={{ uri: pet.profile_image_url }}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                  />
                ) : (
                  <View
                    className="h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: pet.theme_color || "#E8E8ED" }}
                  >
                    <Text className="text-[10px] font-bold text-[#0D0F1B]">
                      {pet.name.slice(0, 1)}
                    </Text>
                  </View>
                )}
                <Text className="ml-1.5 text-xs font-semibold text-[#0D0F1B]">
                  {pet.name}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-3 text-xs font-semibold text-[#0D0F1B]">
            페이스 {item.average_pace}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            {item.distance_km} km · {item.duration_min}분
          </Text>
        </View>
      ))}
    </View>
  );
};

export default WeeklyDaySummary;
