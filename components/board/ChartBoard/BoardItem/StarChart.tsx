import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

//1. 총 이동 거리
// 2. 평균 이동 속도
// 3. 산책 빈도 (일수)
// 4. 휴식 시간

interface ChartData {
  metric_code: string;
  label: string;
  this_week_value: number;
  last_week_value: number;
  max_score: number; // 최대 점수 100점
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
    <View className=" mx-4 mt-4 rounded-lg bg-white p-4">
      <View className="relative items-center justify-center">
        {lastWeekNormalizedData.length > 0 && (
          <RadarChart
            data={lastWeekNormalizedData}
            labels={["이동 거리", "평균 속도", "산책 빈도", "휴식 시간"]}
            maxValue={100}
            chartSize={300}
            noOfSections={5}
            polygonConfig={{
              stroke: "#36A2EB",
              strokeWidth: 2,
              fill: "rgba(54, 162, 235, 0.3)",
            }}
            gridConfig={{
              opacity: 0,
            }}
            asterLinesConfig={{
              stroke: "#36A2EB",
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
              chartSize={300}
              hideGrid
              polygonConfig={{
                stroke: "#FF6384",
                strokeWidth: 2.5,
                fill: "rgba(255, 99, 132, 0.5)",
              }}
              circular
            />
          </View>
        )}
        {[20, 40, 60, 80, 100].map((val, idx) => {
          const distance = 24 * (idx + 1);
          return (
            <Text
              key={val}
              style={{
                position: "absolute",
                color: "#9CA3AF",
                fontSize: 10,
                bottom: "50%",
                marginBottom: distance, // 위로 띄우기 (텍스트 세로 중앙 정렬 보정값 -6px)
                left: "50%",
                marginLeft: 4,
              }}
              pointerEvents="none"
            >
              {val}
            </Text>
          );
        })}
      </View>
      <View className=" flex-col items-end gap-2 pr-2">
        <View className="flex-row items-center">
          <View className="mr-2 h-4 w-4 rounded-full bg-[#36A2EB]" />
          <Text>지난 주</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-4 w-4 rounded-full bg-[#FF6384]" />
          <Text>이번 주</Text>
        </View>
      </View>
    </View>
  );
};

export default StarChart;
