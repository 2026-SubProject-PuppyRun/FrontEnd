import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { createWeightLog } from "./api";

const listKey = (petId: string) => queryKeys.weights.list(petId);

export const useCreateWeightLogMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weight: number) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      return createWeightLog(petId, { weight });
    },
    onSuccess: async () => {
      if (!petId) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listKey(petId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.pets.list() }),
      ]);
    },
  });
};
