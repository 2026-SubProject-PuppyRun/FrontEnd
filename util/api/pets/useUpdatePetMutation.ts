import { usePetStore } from "@/store/usePetStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  getPetList,
  isLocalImageUri,
  updatePet,
  uploadPetProfile,
  type UpdatePetRequest,
} from "./api";

export type UpdatePetParams = {
  petId: string;
  request: UpdatePetRequest;
  /** 새로 고른 로컬 이미지 URI만 업로드 */
  profileImageUri?: string | null;
};

/**
 * 반려견 수정 → (로컬 이미지면) 프로필 업로드 → 목록 갱신
 */
export const useUpdatePetMutation = () => {
  const queryClient = useQueryClient();
  const setPetList = usePetStore((state) => state.setPetList);

  return useMutation({
    mutationFn: async ({
      petId,
      request,
      profileImageUri,
    }: UpdatePetParams) => {
      const updated = await updatePet(petId, request);

      if (isLocalImageUri(profileImageUri)) {
        await uploadPetProfile(petId, { uri: profileImageUri! });
      }

      return updated;
    },
    onSuccess: async () => {
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
