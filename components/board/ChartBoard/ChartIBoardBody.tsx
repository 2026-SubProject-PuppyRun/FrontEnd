import ChartTapButton from "@/components/button/ChartTapButton";
import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CompareChart from "./BoardItem/CompareChart";
import GrassChart from "./BoardItem/GrassChart";
import MonthlyChart from "./BoardItem/MonthlyChart";
import StarChart from "./BoardItem/StarChart";
import UserInsight from "./BoardItem/UserInsight";
import WeeklyChart from "./BoardItem/WeeklyChart";

const CHART_TABS = [
  { label: "주간", value: "weekly" },
  { label: "월간", value: "monthly" },
] as const;

type ChartTab = (typeof CHART_TABS)[number]["value"];

const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

const ChartBoardBody = () => {
  const [selectedChart, setSelectedChart] = useState<ChartTab>("weekly");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [referenceDate, setReferenceDate] = useState(dayjs());
  const tabWidth = useSharedValue(0);
  const selectedIndex = useSharedValue(0);

  const handlePrevWeek = () => {
    setReferenceDate((prev) => prev.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    setReferenceDate((prev) => prev.add(7, "day"));
  };

  const handleSelectChart = (value: string) => {
    const next = value as ChartTab;
    const nextIndex = CHART_TABS.findIndex((tab) => tab.value === next);
    const prevIndex = CHART_TABS.findIndex((tab) => tab.value === selectedChart);
    if (nextIndex < 0 || nextIndex === prevIndex) return;

    setDirection(nextIndex > prevIndex ? 1 : -1);
    selectedIndex.value = nextIndex;
    setSelectedChart(next);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: tabWidth.value,
    transform: [
      {
        translateX: withTiming(selectedIndex.value * tabWidth.value, TIMING),
      },
    ],
  }));

  const renderChart = () => {
    switch (selectedChart) {
      case "weekly":
        return (
          <WeeklyChart
            referenceDate={referenceDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        );
      case "monthly":
        return <MonthlyChart />;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <UserInsight />

      <View className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="mb-4 text-sm font-semibold text-gray-500">
          기간별 산책량
        </Text>

        <View
          className="relative mb-5 flex-row rounded-2xl bg-[#F7F7F7] p-1"
          onLayout={(e) => {
            const innerWidth = e.nativeEvent.layout.width - 8; // p-1 * 2
            tabWidth.value = innerWidth / CHART_TABS.length;
          }}
        >
          <Animated.View
            pointerEvents="none"
            className="absolute bottom-1 left-1 top-1 rounded-xl bg-[#F25857]"
            style={indicatorStyle}
          />
          {CHART_TABS.map((tab) => (
            <ChartTapButton
              key={tab.value}
              handleSelectChart={handleSelectChart}
              label={tab.label}
              value={tab.value}
              isActive={selectedChart === tab.value}
            />
          ))}
        </View>

        <View className="overflow-hidden">
          <Animated.View
            key={selectedChart}
            entering={
              direction > 0
                ? FadeInRight.duration(220)
                : FadeInLeft.duration(220)
            }
            exiting={FadeOut.duration(140)}
          >
            {renderChart()}
          </Animated.View>
        </View>
      </View>

      <CompareChart
        key={`compare-${referenceDate.format("YYYY-MM-DD")}`}
        referenceDate={referenceDate}
      />

      <Text className="mb-3 mt-5 text-base font-semibold text-[#0D0F1B]">
        주간 활동 비교
      </Text>
      <StarChart
        key={`radar-${referenceDate.format("YYYY-MM-DD")}`}
        referenceDate={referenceDate}
      />

      <Text className="mb-3 mt-5 text-base font-semibold text-[#0D0F1B]">
        산책 잔디심기
      </Text>
      <GrassChart />
    </ScrollView>
  );
};

export default ChartBoardBody;
