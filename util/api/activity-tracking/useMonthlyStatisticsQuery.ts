import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { queryKeys } from "../core/queryKeys";
import {
  getMonthlyStatistics,
  type MonthlyStatisticsResponse,
} from "./api";

const MONTH_LABELS: Record<string, string> = {
  JANUARY: "1월",
  FEBRUARY: "2월",
  MARCH: "3월",
  APRIL: "4월",
  MAY: "5월",
  JUNE: "6월",
  JULY: "7월",
  AUGUST: "8월",
  SEPTEMBER: "9월",
  OCTOBER: "10월",
  NOVEMBER: "11월",
  DECEMBER: "12월",
};

export type MonthlyLineItem = {
  label: string;
  value: number;
};

/** API monthly_summary → 월별 거리(km) 라인 데이터 */
export const mapMonthlyLineItems = (
  response: MonthlyStatisticsResponse,
): MonthlyLineItem[] =>
  response.monthly_summary.map((item) => ({
    label: MONTH_LABELS[item.label] ?? item.label,
    value: Math.round((item.total_distance_m / 1000) * 100) / 100,
  }));

/** 기준 연도의 월간 통계 (referenceDate가 속한 해) */
export const useMonthlyStatisticsQuery = (referenceDate: Dayjs) => {
  const year = referenceDate.format("YYYY");
  const dateKey = referenceDate.isSame(dayjs(), "year")
    ? dayjs().format("YYYY-MM-DD")
    : referenceDate.endOf("year").format("YYYY-MM-DD");

  return useQuery({
    queryKey: queryKeys.activityTracking.monthlyStatistics(year),
    queryFn: () => getMonthlyStatistics(dateKey),
    staleTime: 0,
    refetchOnMount: "always",
  });
};
