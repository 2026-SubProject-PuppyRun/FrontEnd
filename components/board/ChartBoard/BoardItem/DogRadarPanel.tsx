import type { WeeklyDogRadar } from "@/util/api/activity-tracking";
import React, { useMemo } from "react";
import { View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

const getRadarLabels = (points: WeeklyDogRadar["data_points"]) =>
  points.map((point) => {
    switch (point.metric_code) {
      case "DISTANCE":
        return "이동 거리";
      case "DURATION":
        return "산책 시간";
      case "SPEED":
        return "평균 속도";
      case "FREQUENCY":
        return "산책 빈도";
      case "REST_TIME":
        return "휴식 시간";
      default:
        return point.label.split(" ")[0];
    }
  });

const normalizePoints = (
  points: WeeklyDogRadar["data_points"],
  key: "this_week_value" | "last_week_value",
) => points.map((point) => Math.min(100, (point[key] / point.max_score) * 100));

type DogRadarPanelProps = {
  dog: WeeklyDogRadar;
};

/** 기존 StarChart 레이더 디자인 (지난 주 + 이번 주 오버레이) */
const DogRadarPanel = ({ dog }: DogRadarPanelProps) => {
  const labels = useMemo(
    () => getRadarLabels(dog.data_points),
    [dog.data_points],
  );

  const thisWeekData = useMemo(
    () => normalizePoints(dog.data_points, "this_week_value"),
    [dog.data_points],
  );
  const lastWeekData = useMemo(
    () => normalizePoints(dog.data_points, "last_week_value"),
    [dog.data_points],
  );

  const hasLastWeek = lastWeekData.some((value) => value > 0);

  const axisConfig = {
    hideGrid: true,
    hideAsterLines: false,
    asterLinesConfig: { stroke: "#E5E7EB", strokeWidth: 1 },
    chartContainerProps: { backgroundColor: "transparent" },
  } as const;

  return (
    <View className="relative items-center justify-center">
      <RadarChart
        {...axisConfig}
        data={lastWeekData}
        labels={labels}
        maxValue={100}
        chartSize={280}
        noOfSections={5}
        polygonConfig={{
          stroke: "#FFB3B2",
          strokeWidth: 2,
          fill: "rgba(255, 179, 178, 0.35)",
          showGradient: false,
        }}
        circular
      />

      <View style={{ position: "absolute" }} pointerEvents="none">
        <RadarChart
          {...axisConfig}
          data={thisWeekData}
          labels={hasLastWeek ? labels.map(() => "") : labels}
          maxValue={100}
          chartSize={280}
          hideLabels={hasLastWeek}
          noOfSections={5}
          polygonConfig={{
            stroke: "#F25857",
            strokeWidth: 2.5,
            fill: "rgba(242, 88, 87, 0.35)",
            showGradient: false,
          }}
          circular
        />
      </View>
    </View>
  );
};

export default DogRadarPanel;
