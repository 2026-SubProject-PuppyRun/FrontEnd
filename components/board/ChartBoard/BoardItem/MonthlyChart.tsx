import ChartDateNavigator from "@/components/navigator/ChartDateNavigator";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import {
  mapMonthlyLineItems,
  useMonthlyStatisticsQuery,
} from "@/util/api/activity-tracking";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MonthlyChart = () => {
  const ref = useRef(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const year = currentDate.year();

  const { data, isPending, isFetching } =
    useMonthlyStatisticsQuery(currentDate);

  const isYearDataReady = data?.period.year === String(year);

  const chartData = useMemo(
    () => (isYearDataReady && data ? mapMonthlyLineItems(data) : []),
    [isYearDataReady, data],
  );

  const showChartSkeleton = isPending || isFetching || !isYearDataReady;

  return (
    <View className="pb-2">
      <ChartDateNavigator
        dateText={`${year}년`}
        currentDate={currentDate}
        onPrev={() => setCurrentDate((prev) => prev.subtract(1, "year"))}
        onNext={() => setCurrentDate((prev) => prev.add(1, "year"))}
        chartType="year"
      />
      {showChartSkeleton ? (
        <ChartSkeleton />
      ) : (
        <LineChart
          key={year}
          scrollRef={ref}
          data={chartData}
          color="#F25857"
          thickness={3}
          dataPointsColor="#F25857"
          hideRules
          isAnimated
          showFractionalValues
          showYAxisIndices
          noOfSections={4}
          xAxisThickness={0}
          yAxisThickness={0}
          overflowBottom={16}
          xAxisLabelsHeight={20}
          initialSpacing={12}
          endSpacing={12}
          spacing={36}
        />
      )}
    </View>
  );
};

export default React.memo(MonthlyChart);
