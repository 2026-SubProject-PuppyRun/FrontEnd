import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getTrackingById } from "./api";
import { mapTrackingDetailToFeedDetail } from "./mapToFeedDetail";

type UseTrackingDetailQueryOptions = {
  enabled?: boolean;
};

/**
 * 피드 상세 — 산책 기록 조회
 * GET /tracking/{id}
 */
export const useTrackingDetailQuery = (
  trackingId: string | undefined,
  { enabled = true }: UseTrackingDetailQueryOptions = {},
) =>
  useQuery({
    queryKey: queryKeys.tracking.detail(trackingId ?? ""),
    queryFn: () => getTrackingById(trackingId!),
    enabled: enabled && Boolean(trackingId),
    staleTime: 1000 * 60 * 2,
    select: mapTrackingDetailToFeedDetail,
  });
