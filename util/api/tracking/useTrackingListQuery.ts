import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  getTrackingList,
  mapTrackingListToFeedCards,
} from "./api";

type UseTrackingListQueryOptions = {
  enabled?: boolean;
};

/**
 * 마이페이지 피드용 산책 기록 목록
 * GET /tracking
 *
 * @example
 * const { data: feedCards, isLoading } = useTrackingListQuery();
 * // feedCards: { id, imgUrl }[]
 */
export const useTrackingListQuery = ({
  enabled = true,
}: UseTrackingListQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.tracking.list(),
    queryFn: getTrackingList,
    enabled,
    staleTime: 1000 * 60 * 2,
    select: mapTrackingListToFeedCards,
  });
