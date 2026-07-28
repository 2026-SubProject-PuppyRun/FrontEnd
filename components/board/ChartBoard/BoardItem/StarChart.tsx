import { Text } from "@/components/ui/text";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

interface ChartData {
  metric_code: string;
  label: string;
  this_week_value: number;
  last_week_value: number;
  max_score: number;
}

const dummyData: ChartData[] = [
  {
    metric_code: "DISTANCE",
    label: "총 이동 거리 (km)",
    this_week_value: 23.0,
    last_week_value: 20.0,
    max_score: 30.0,
  },
  {
    metric_code: "SPEED",
    label: "평균 이동 속도 (km/h)",
    this_week_value: 5.0,
    last_week_value: 7.5,
    max_score: 10.0,
  },
  {
    metric_code: "FREQUENCY",
    label: "산책 빈도 (일)",
    this_week_value: 5.0,
    last_week_value: 4.0,
    max_score: 7.0,
  },
  {
    metric_code: "REST_TIME",
    label: "휴식 시간 (분)",
    this_week_value: 60.0,
    last_week_value: 50.0,
    max_score: 120.0,
  },
];

const StarChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [thisWeekNormalizedData, setThisWeekNormalizedData] = useState<
    number[]
  >([]);
  const [lastWeekNormalizedData, setLastWeekNormalizedData] = useState<
    number[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const fetchChartData = async () => {
        setLastWeekNormalizedData([]);
        setThisWeekNormalizedData([]);
        setChartData(dummyData);
      };

      const normalizeData = (data: ChartData[]) => {
        const thisWeekData = data.map(
          (item) => (item.this_week_value / item.max_score) * 100,
        );
        const lastWeekData = data.map(
          (item) => (item.last_week_value / item.max_score) * 100,
        );
        setThisWeekNormalizedData(thisWeekData);
        setLastWeekNormalizedData(lastWeekData);
      };

      fetchChartData();
      if (chartData.length > 0) {
        normalizeData(chartData);
      }
    }, [chartData]),
  );

  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      <View className="relative items-center justify-center">
        {lastWeekNormalizedData.length > 0 && (
          <RadarChart
            data={lastWeekNormalizedData}
            labels={["이동 거리", "평균 속도", "산책 빈도", "휴식 시간"]}
            maxValue={100}
            chartSize={280}
            noOfSections={5}
            polygonConfig={{
              stroke: "#FFB3B2",
              strokeWidth: 2,
              fill: "rgba(255, 179, 178, 0.35)",
            }}
            gridConfig={{
              opacity: 0,
            }}
            asterLinesConfig={{
              stroke: "#E5E7EB",
            }}
            circular
          />
        )}

        {thisWeekNormalizedData.length > 0 && (
          <View style={{ position: "absolute" }} pointerEvents="none">
            <RadarChart
              data={thisWeekNormalizedData}
              labels={["", "", "", ""]}
              maxValue={100}
              chartSize={280}
              hideGrid
              polygonConfig={{
                stroke: "#F25857",
                strokeWidth: 2.5,
                fill: "rgba(242, 88, 87, 0.35)",
              }}
              circular
            />
          </View>
        )}
      </View>

      <View className="mt-2 flex-row justify-end gap-4 pr-1">
        <View className="flex-row items-center">
          <View className="mr-2 h-3.5 w-3.5 rounded-full bg-[#FFB3B2]" />
          <Text className="text-sm text-gray-500">지난 주</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-3.5 w-3.5 rounded-full bg-[#F25857]" />
          <Text className="text-sm text-gray-500">이번 주</Text>
        </View>
      </View>
    </View>
  );
};

export default StarChart;
