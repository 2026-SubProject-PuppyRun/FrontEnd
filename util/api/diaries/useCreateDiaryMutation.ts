import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { createDiary, type CreateDiaryRequest } from "./api";

/**
 * 산책 일기 등록 mutation
 *
 * @example
 * const { mutateAsync, isPending } = useCreateDiaryMutation();
 * await mutateAsync(request);
 */
export const useCreateDiaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDiaryRequest) => createDiary(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.walks.recentSummaries(),
      });
    },
  });
};
