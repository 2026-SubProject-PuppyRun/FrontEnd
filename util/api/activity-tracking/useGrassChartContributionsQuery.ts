import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { queryKeys } from "../core/queryKeys";
import { getMonthlyContributions } from "./api";

export const GRASS_CHART_DAYS = 130;

/** start~end 구간에 걸친 각 월의 기준일(YYYY-MM-DD) 목록 */
const getMonthAnchorDates = (start: Dayjs, end: Dayjs): string[] => {
  const dates: string[] = [];
  let cursor = start.startOf("month");

  while (cursor.isBefore(end) || cursor.isSame(end, "month")) {
    const anchor = cursor.isBefore(start) ? start : cursor;
    dates.push(anchor.format("YYYY-MM-DD"));
    cursor = cursor.add(1, "month");
  }

  return dates;
};

/** activity_chart를 label → tracking_count 맵으로 변환 */
export const mergeContributionsToMap = (
  charts: { activity_chart: { label: string; tracking_count: number }[] }[],
): Record<string, number> => {
  const map: Record<string, number> = {};

  for (const { activity_chart } of charts) {
    for (const item of activity_chart) {
      map[item.label] = item.tracking_count;
    }
  }

  return map;
};

/**
 * 잔디심기 차트용 기여도 (최근 GRASS_CHART_DAYS일, 월별 API 병렬 조회)
 */
export const useGrassChartContributionsQuery = () => {
  const endDate = dayjs();
  const startDate = endDate.subtract(GRASS_CHART_DAYS - 1, "day");
  const monthDates = getMonthAnchorDates(startDate, endDate);

  return useQuery({
    queryKey: queryKeys.activityTracking.grassChart(
      endDate.format("YYYY-MM-DD"),
    ),
    queryFn: async () => {
      const responses = await Promise.all(
        monthDates.map((date) => getMonthlyContributions(date)),
      );
      return mergeContributionsToMap(responses);
    },
    staleTime: 1000 * 60 * 5,
  });
};
