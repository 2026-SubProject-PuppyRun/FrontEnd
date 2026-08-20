import { usePetStore } from "@/store/usePetStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  createPet,
  getCreatedPetId,
  getPetList,
  uploadPetProfile,
  type CreatePetRequest,
} from "./api";

export type CreatePetParams = {
  request: CreatePetRequest;
  /** 로컬 이미지 URI — 등록 성공 후 PUT /pets/{id}/profile */
  profileImageUri?: string | null;
};

/**
 * 반려견 등록 → (선택) 프로필 이미지 업로드 → 목록 갱신
 */
export const useCreatePetMutation = () => {
  const queryClient = useQueryClient();
  const setPetList = usePetStore((state) => state.setPetList);

  return useMutation({
    mutationFn: async ({ request, profileImageUri }: CreatePetParams) => {
      const created = await createPet(request);
      const petId = getCreatedPetId(created);

      if (!petId) {
        throw new Error("등록 응답에 pet_id가 없습니다.");
      }

      if (profileImageUri) {
        await uploadPetProfile(petId, { uri: profileImageUri });
      }

      return { ...created, pet_id: petId };
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
