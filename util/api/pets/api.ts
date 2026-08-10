import type { Pet } from "@/store/usePetStore";
import { apiGet, apiPost, apiPut, apiPutForm } from "../core/client";

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

/** POST /pets 요청 */
export type CreatePetRequest = {
  name: string;
  /** 모름이면 생략 또는 null */
  birth_year?: string | null;
  breed_code: string;
  is_neutered: boolean;
  gender: "M" | "F";
  color: string | null;
  weight: number;
};

/** POST /pets 응답 */
export type CreatePetResponse = {
  pet_id: string;
  name?: string;
  birth_year?: string | null;
  weight?: number;
  color?: string;
  profile_image_url?: string | null;
  breed_code?: string;
  gender?: "F" | "M";
  is_neutered?: boolean;
  badge_code?: string;
};

export type PetProfileImage = {
  uri: string;
  name?: string;
  type?: string;
};

const guessImageMeta = (uri: string) => {
  const lower = uri.toLowerCase();
  if (lower.includes(".png")) {
    return { name: "profile.png", type: "image/png" };
  }
  if (lower.includes(".webp")) {
    return { name: "profile.webp", type: "image/webp" };
  }
  if (lower.includes(".heic") || lower.includes(".heif")) {
    return { name: "profile.heic", type: "image/heic" };
  }
  return { name: "profile.jpg", type: "image/jpeg" };
};

/**
 * 반려견 등록
 * POST /pets
 * - birth_year가 없으면(모름) 필드 자체를 보내지 않음
 */
export const createPet = (payload: CreatePetRequest) => {
  const body: Record<string, unknown> = {
    name: payload.name,
    breed_code: payload.breed_code,
    is_neutered: payload.is_neutered,
    gender: payload.gender,
    color: payload.color,
    weight: payload.weight,
  };

  if (payload.birth_year) {
    body.birth_year = payload.birth_year;
  }

  return apiPost<CreatePetResponse>("/pets", body);
};

/** PUT /pets/{petId} 요청 — 프로필 이미지는 별도 API */
export type UpdatePetRequest = {
  name: string;
  birth_year?: string | null;
  weight: number;
  is_neutered: boolean;
  gender: "M" | "F";
  color: string;
};

export type UpdatePetResponse = {
  pet_id?: string;
  name?: string;
  birth_year?: string | null;
  weight?: number;
  color?: string;
  profile_image_url?: string | null;
  breed_code?: string;
  gender?: "F" | "M";
  is_neutered?: boolean;
};

/**
 * 반려견 정보 수정
 * PUT /pets/{petId}
 */
export const updatePet = (petId: string, payload: UpdatePetRequest) => {
  const body: Record<string, unknown> = {
    name: payload.name,
    weight: payload.weight,
    is_neutered: payload.is_neutered,
    gender: payload.gender,
    color: payload.color,
  };

  if (payload.birth_year) {
    body.birth_year = payload.birth_year;
  } else {
    body.birth_year = null;
  }

  return apiPut<UpdatePetResponse>(`/pets/${petId}`, body);
};

/** 로컬(기기) 이미지 URI인지 — 원격 URL이면 재업로드 불필요 */
export const isLocalImageUri = (uri?: string | null) => {
  if (!uri) return false;
  return (
    uri.startsWith("file:") ||
    uri.startsWith("content:") ||
    uri.startsWith("ph:") ||
    uri.startsWith("assets-library:") ||
    uri.startsWith("/")
  );
};

/**
 * 반려견 프로필 이미지 업로드
 * PUT /pets/{petId}/profile (multipart, field: profile)
 */
export const uploadPetProfile = (
  petId: string,
  image: PetProfileImage,
) => {
  const meta = guessImageMeta(image.uri);
  const formData = new FormData();
  formData.append("profile", {
    uri: image.uri,
    name: image.name ?? meta.name,
    type: image.type ?? meta.type,
  } as unknown as Blob);

  return apiPutForm<unknown>(`/pets/${petId}/profile`, formData);
};

export const getCreatedPetId = (response: CreatePetResponse) =>
  response.pet_id;
