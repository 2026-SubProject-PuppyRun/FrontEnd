import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { updateDiary, type UpdateDiaryParams } from "./api";

type UpdateDiaryMutationParams = UpdateDiaryParams & {
  trackingId: string;
};

/**
 * 산책 일기 수정 mutation
 * PUT /diaries/{id}
 */
export const useUpdateDiaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      diaryId,
      title,
      content,
      weather,
    }: UpdateDiaryMutationParams) =>
      updateDiary(diaryId, { title, content, weather }),
    onSuccess: async (_data, { trackingId }) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tracking.detail(trackingId),
      });
    },
  });
};
