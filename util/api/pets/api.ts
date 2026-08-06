import type { Pet } from "@/store/usePetStore";
import { apiGet } from "../core/client";
import type { PaginatedResponse } from "../core/types";

/** GET /pets 응답 예시 */
export type PetListResponse = PaginatedResponse<Pet>;

/**
 * 반려견 목록 조회
 * @example
 * const { items, totalCount } = await getPetList();
 */
export const getPetList = () => apiGet<PetListResponse>("/pets");

/**
 * 반려견 단건 조회
 * @example
 * const pet = await getPetById("pet-uuid");
 */
export const getPetById = (petId: string) => apiGet<Pet>(`/pets/${petId}`);
