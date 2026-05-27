import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import { getWeekName } from "@/util/date";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
const DOG_IMAGES = [
  "https://picsum.photos/id/237/200/200", // 검은 강아지
  "https://picsum.photos/id/1025/200/200", // 둥지 튼 퍼그
  "https://picsum.photos/id/1062/200/200", // 담요 덮은 개
];

interface WeeklyDataItem {
  label: string;
  value: number;
  puppy?: { img: string; pace?: number; distance?: number; time?: number }[];
}

const WeeklyData: WeeklyDataItem[] = [
  {
    label: "일",
    value: 70,
    puppy: [
      { img: DOG_IMAGES[0], pace: 6.2, distance: 3.5, time: 45 },
      { img: DOG_IMAGES[1], pace: 5.8, distance: 2.1, time: 25 },
      { img: DOG_IMAGES[2], pace: 7.1, distance: 4.0, time: 60 },
    ],
  },
  {
    label: "월",
    value: 10,
    puppy: [{ img: DOG_IMAGES[0], pace: 5.5, distance: 1.2, time: 15 }],
  },
  {
    label: "화",
    value: 20,
    puppy: [
      { img: DOG_IMAGES[1], pace: 6.0, distance: 2.0, time: 20 },
      { img: DOG_IMAGES[2], pace: 5.2, distance: 1.5, time: 18 },
    ],
  },
  {
    label: "수",
    value: 30,
    puppy: [
      { img: DOG_IMAGES[0], pace: 4.8, distance: 3.1, time: 35 },
      { img: DOG_IMAGES[1], pace: 5.5, distance: 1.8, time: 22 },
    ],
  },
  {
    label: "목",
    value: 40,
    puppy: [
      { img: DOG_IMAGES[2], pace: 6.5, distance: 1.5, time: 15 },
      { img: DOG_IMAGES[0], pace: 5.1, distance: 2.7, time: 30 },
      { img: DOG_IMAGES[1], pace: 5.9, distance: 1.0, time: 12 },
    ],
  },
  {
    label: "금",
    value: 50,
    puppy: [
      { img: DOG_IMAGES[1], pace: 5.0, distance: 2.5, time: 28 },
      { img: DOG_IMAGES[2], pace: 6.3, distance: 3.2, time: 40 },
    ],
  },
  {
    label: "토",
    value: 60,
    puppy: [
      { img: DOG_IMAGES[0], pace: 6.8, distance: 5.0, time: 80 },
      { img: DOG_IMAGES[1], pace: 5.4, distance: 2.8, time: 30 },
      { img: DOG_IMAGES[2], pace: 7.5, distance: 4.2, time: 70 },
    ],
  },
];

const WeeklyChart = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const year = currentDate.year();
  const month = currentDate.month() + 1;
  const weekName = getWeekName(currentDate);
  const dateText = `${year}년 ${month}월 ${weekName} 주`;
  const weekKey = currentDate.startOf("week").format("YYYY-MM-DD");
  const [dayData, setDayData] = useState<WeeklyDataItem["puppy"] | null>(null);

  const handleBarPress = (item: WeeklyDataItem) => {
    setDayData(item.puppy || null);
  };
  const handlePrevWeek = () => {
    setCurrentDate((prev) => prev.subtract(1, "week"));
    setDayData(null);
  };
  const handleNextWeek = () => {
    setCurrentDate((prev) => prev.add(1, "week"));
    setDayData(null);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["weeklyData", weekKey],
    queryFn: async () => {
      return WeeklyData;
    },
  });

  return (
    <View>
      <ChartDateNavigator
        dateText={dateText}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        currentDate={currentDate}
        chartType="week"
      />
      {isLoading || !data ? (
        <ChartSkeleton />
      ) : (
        <BarChart
          data={data}
          onPress={handleBarPress}
          barBorderRadius={4}
          barWidth={22}
          hideRules
          isAnimated
          showFractionalValues
          showYAxisIndices
          noOfSections={4}
          xAxisThickness={0}
          yAxisThickness={0}
        />
      )}
      {dayData && (
        <View className="mt-8 flex-row flex-wrap justify-center gap-2">
          {dayData.map((puppy, index) => (
            <View
              key={index}
              className="min-w-[150px] items-center rounded-lg bg-gray-200 p-2"
            >
              <Image
                source={{ uri: puppy.img }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
              <Text className="mt-2 text-sm">페이스: {puppy.pace} min/km</Text>
              <Text className="text-sm">거리: {puppy.distance} km</Text>
              <Text className="text-sm">시간: {puppy.time} min</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(WeeklyChart);
