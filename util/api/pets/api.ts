import type { Pet } from "@/store/usePetStore";
import { apiGet } from "../core/client";

/** GET /pets — 펫 요약 (snake_case) */
export type PetSummaryDto = {
  pet_id: string;
  name: string;
  birth_year: string | null;
  weight: number;
  color: string;
  profile_image_url: string | null;
  breed_code: string;
  gender?: "F" | "M";
  is_neutered?: boolean;
};

/** GET /pets 응답 */
export type PetListResponse = {
  total_pet_count: number;
  pet_summary_list: PetSummaryDto[];
};

export type MappedPetList = {
  items: Pet[];
  totalCount: number;
};

export const mapPetSummaryToPet = (dto: PetSummaryDto): Pet => ({
  petId: dto.pet_id,
  name: dto.name,
  birthYear: dto.birth_year,
  weight: dto.weight,
  color: dto.color,
  profileImageUrl: dto.profile_image_url,
  breedCode: dto.breed_code,
  badgeCode: "000",
  gender: dto.gender,
  isNeutered: dto.is_neutered,
});

export const mapPetListResponse = (
  response: PetListResponse,
): MappedPetList => ({
  items: (response.pet_summary_list ?? []).map(mapPetSummaryToPet),
  totalCount: response.total_pet_count ?? 0,
});

/**
 * 반려견 목록 조회
 * GET /pets
 */
export const getPetList = async (): Promise<MappedPetList> => {
  const response = await apiGet<PetListResponse>("/pets");
  return mapPetListResponse(response);
};

/**
 * 반려견 단건 조회
 * GET /pets/{petId}
 */
export const getPetById = (petId: string) =>
  apiGet<PetSummaryDto>(`/pets/${petId}`).then(mapPetSummaryToPet);
