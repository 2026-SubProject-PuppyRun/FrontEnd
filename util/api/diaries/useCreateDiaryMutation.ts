import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { createDiary, type CreateDiaryParams } from "./api";

/**
 * 산책 일기 등록 mutation
 *
 * @example
 * const { mutateAsync, isPending } = useCreateDiaryMutation();
 * await mutateAsync({ request, images });
 */
export const useCreateDiaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateDiaryParams) => createDiary(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.walks.recentSummaries(),
      });
    },
  });
};
