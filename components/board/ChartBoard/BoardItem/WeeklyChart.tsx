import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import {
  mapWeeklyBarItems,
  useDailyStatisticsQuery,
  useWeeklyStatisticsQuery,
  type WeeklyBarItem,
} from "@/util/api/activity-tracking";
import { getWeekName } from "@/util/date";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import WeeklyDaySummary from "./WeeklyDaySummary";

const ACTIVE_BAR_COLOR = "#F25857";
const INACTIVE_BAR_COLOR = "#FADADD";

type WeeklyChartProps = {
  referenceDate: Dayjs;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

const WeeklyChart = ({
  referenceDate,
  onPrevWeek,
  onNextWeek,
}: WeeklyChartProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const weekEndKey = referenceDate.format("YYYY-MM-DD");

  const year = referenceDate.year();
  const month = referenceDate.month() + 1;
  const weekName = getWeekName(referenceDate);
  const dateText = `${year}년 ${month}월 ${weekName} 주`;

  const { data: weeklyData, isPending, isFetching } =
    useWeeklyStatisticsQuery(referenceDate);
  const {
    data: dailyData,
    isLoading: isDailyLoading,
    isError: isDailyError,
  } = useDailyStatisticsQuery(selectedDate);

  const isWeekDataReady =
    weeklyData?.period.end_date === weekEndKey &&
    weeklyData.period.start_date != null;

  const barData = useMemo(
    () => (isWeekDataReady && weeklyData ? mapWeeklyBarItems(weeklyData) : []),
    [isWeekDataReady, weeklyData],
  );

  const chartData = useMemo(
    () =>
      barData.map((item) => ({
        ...item,
        frontColor:
          item.date === selectedDate ? ACTIVE_BAR_COLOR : INACTIVE_BAR_COLOR,
      })),
    [barData, selectedDate],
  );

  const chartKey = isWeekDataReady
    ? `${weeklyData!.period.start_date}-${weeklyData!.period.end_date}`
    : weekEndKey;

  const showChartSkeleton = isPending || isFetching || !isWeekDataReady;

  const handleBarPress = (item: WeeklyBarItem) => {
    setSelectedDate(item.date);
  };

  const handlePrevWeek = () => {
    onPrevWeek();
    setSelectedDate(null);
  };

  const handleNextWeek = () => {
    onNextWeek();
    setSelectedDate(null);
  };

  return (
    <View>
      <ChartDateNavigator
        dateText={dateText}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        currentDate={referenceDate}
        chartType="week"
        disableNext={
          referenceDate.isSame(dayjs(), "day") ||
          referenceDate.isAfter(dayjs(), "day")
        }
      />
      {showChartSkeleton ? (
        <ChartSkeleton />
      ) : (
        <BarChart
          key={chartKey}
          data={chartData}
          onPress={handleBarPress}
          barBorderRadius={6}
          barWidth={22}
          frontColor={ACTIVE_BAR_COLOR}
          hideRules
          isAnimated={false}
          showFractionalValues
          showYAxisIndices
          noOfSections={4}
          xAxisThickness={0}
          yAxisThickness={0}
        />
      )}

      {selectedDate && (
        <WeeklyDaySummary
          date={selectedDate}
          data={dailyData}
          isLoading={isDailyLoading}
          isError={isDailyError}
        />
      )}
    </View>
  );
};

export default React.memo(WeeklyChart);
