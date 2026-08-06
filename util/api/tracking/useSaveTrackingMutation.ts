import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  saveTracking,
  type SaveTrackingParams,
} from "./api";

/**
 * 산책 기록 저장 mutation
 *
 * @example
 * const { mutateAsync, isPending } = useSaveTrackingMutation();
 * await mutateAsync({ request, images });
 */
export const useSaveTrackingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SaveTrackingParams) => saveTracking(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.walks.recentSummaries(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tracking.list(),
      });
    },
  });
};
