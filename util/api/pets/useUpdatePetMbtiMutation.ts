import { usePetStore } from "@/store/usePetStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getPetList, updatePetMbti } from "./api";

export type UpdatePetMbtiParams = {
  petId: string;
  mbti: string;
};

/**
 * 반려견 MBTI 저장 후 목록/스토어 동기화
 */
export const useUpdatePetMbtiMutation = () => {
  const queryClient = useQueryClient();
  const setPetList = usePetStore((state) => state.setPetList);

  return useMutation({
    mutationFn: ({ petId, mbti }: UpdatePetMbtiParams) =>
      updatePetMbti(petId, mbti),
    onSuccess: async (_data, { petId, mbti }) => {
      const currentList = usePetStore.getState().petList;
      if (currentList) {
        setPetList(
          currentList.map((pet) =>
            pet.petId === petId ? { ...pet, mbti } : pet,
          ),
          currentList.length,
        );
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
