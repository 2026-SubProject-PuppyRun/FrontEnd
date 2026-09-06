import { usePetStore } from "@/store/usePetStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { deletePet, getPetList } from "./api";

/**
 * 반려견 삭제 후 목록/스토어 동기화
 */
export const useDeletePetMutation = () => {
  const queryClient = useQueryClient();
  const setPetList = usePetStore((state) => state.setPetList);

  return useMutation({
    mutationFn: (petId: string) => deletePet(petId),
    onSuccess: async (_data, petId) => {
      const currentList = usePetStore.getState().petList;
      if (currentList) {
        const next = currentList.filter((pet) => pet.petId !== petId);
        setPetList(next, next.length);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.list() });
      try {
        const list = await getPetList();
        setPetList(list.items, list.totalCount);
        queryClient.setQueryData(queryKeys.pets.list(), list);
      } catch (error) {
        console.warn("반려견 목록 재조회 실패:", error);
      }
    },
  });
};
