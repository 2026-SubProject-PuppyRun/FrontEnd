import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { saveWalk, type SaveWalkRequest } from "./api";

/**
 * 산책 저장 mutation 예시.
 * 성공 시 최근 요약 캐시를 무효화해 홈 화면이 갱신되도록 함.
 *
 * @example
 * const { mutate, isPending } = useSaveWalkMutation();
 * mutate({ petIds, route, ... });
 */
export const useSaveWalkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveWalkRequest) => saveWalk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.walks.recentSummaries(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityTracking.all,
      });
    },
  });
};
