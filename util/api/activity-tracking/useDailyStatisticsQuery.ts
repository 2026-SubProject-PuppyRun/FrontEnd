import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getDailyStatistics } from "./api";

/** 선택한 날짜의 일간 산책 통계 */
export const useDailyStatisticsQuery = (date: string | null) =>
  useQuery({
    queryKey: queryKeys.activityTracking.dailyStatistics(date ?? ""),
    queryFn: () => getDailyStatistics(date!),
    enabled: Boolean(date),
    staleTime: 0,
    refetchOnMount: "always",
  });
