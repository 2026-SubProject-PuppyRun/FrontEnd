import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  updateTrackingVisibility,
  type TrackingVisibility,
} from "./api";

type UpdateVisibilityParams = {
  trackingId: string;
  visibility: TrackingVisibility;
};

/**
 * 산책 공개 여부 변경
 * PATCH /tracking/{id}/visibility
 */
export const useUpdateTrackingVisibilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trackingId, visibility }: UpdateVisibilityParams) =>
      updateTrackingVisibility(trackingId, { visibility }),
    onSuccess: async (_data, { trackingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.tracking.detail(trackingId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.tracking.list(),
        }),
      ]);
    },
  });
};
