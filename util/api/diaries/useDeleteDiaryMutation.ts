import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { deleteDiary } from "./api";

type DeleteDiaryMutationParams = {
  diaryId: string;
  trackingId: string;
};

/**
 * 산책 일기 삭제 mutation
 * DELETE /diaries/{id}
 */
export const useDeleteDiaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diaryId }: DeleteDiaryMutationParams) =>
      deleteDiary(diaryId),
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
