import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getRecentWalkSummaries } from "./api";

/**
 * 홈 '최근 산책 요약' 캐러셀용 React Query 예시.
 *
 * @example
 * // HomeSummarySwiper.tsx
 * const { data, isLoading } = useRecentWalkSummariesQuery();
 * const summaries = data?.summaries ?? [];
 */
export const useRecentWalkSummariesQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.walks.recentSummaries(),
    queryFn: getRecentWalkSummaries,
    enabled,
    staleTime: 1000 * 60 * 2,
  });
