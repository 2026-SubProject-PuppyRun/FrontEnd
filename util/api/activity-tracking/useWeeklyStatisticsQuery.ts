import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { queryKeys } from "../core/queryKeys";
import { getWeeklyStatistics, type WeeklyStatisticsResponse } from "./api";

export const WEEKDAY_LABELS = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
] as const;

export type WeeklyBarItem = {
  label: string;
  value: number;
  date: string;
};

export const DOG_CHART_PALETTE = [
  "#F25857",
  "#FFB3B2",
  "#7C83FD",
  "#FFB347",
  "#6BCB77",
  "#0D0F1B",
] as const;

export const resolveDogColor = (themeColor: string | null, index: number) => {
  const normalized = themeColor?.trim().toUpperCase();
  if (normalized && normalized !== "#FFFFFF") {
    return themeColor!;
  }
  return DOG_CHART_PALETTE[index % DOG_CHART_PALETTE.length];
};

/** API activity_chart → 7일 막대 데이터 */
export const mapWeeklyBarItems = (
  response: WeeklyStatisticsResponse,
): WeeklyBarItem[] => {
  // console.log("response", response);
  const { period, activity_chart } = response;
  const start = dayjs(period.start_date);
  const distanceByDate = Object.fromEntries(
    activity_chart.map((item) => [item.date, item.distance_km]),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const day = start.add(index, "day");
    const dateKey = day.format("YYYY-MM-DD");
    return {
      label: WEEKDAY_LABELS[day.day()],
      value: distanceByDate[dateKey] ?? 0,
      date: dateKey,
    };
  });
};

/** 기준일 포함 최근 7일 주간 통계 */
export const useWeeklyStatisticsQuery = (referenceDate: Dayjs) => {
  const dateKey = referenceDate.format("YYYY-MM-DD");

  return useQuery({
    queryKey: queryKeys.activityTracking.weeklyStatistics(dateKey),
    queryFn: () => getWeeklyStatistics(dateKey),
    staleTime: 0,
    refetchOnMount: "always",
  });
};
