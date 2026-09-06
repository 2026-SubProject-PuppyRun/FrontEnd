import type { Pet } from "@/store/usePetStore";
import { apiDelete, apiGet, apiPost, apiPut, apiPutForm } from "../core/client";

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
  mbti?: string | null;
  badge_code?: string;
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
  badgeCode: dto.badge_code ?? "000",
  gender: dto.gender,
  isNeutered: dto.is_neutered,
  mbti: dto.mbti?.trim() || undefined,
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
 */
export const createPet = (payload: CreatePetRequest) => {
  const body: Record<string, unknown> = {
    name: payload.name,
    breed_code: payload.breed_code,
    is_neutered: payload.is_neutered,
    gender: payload.gender,
    color: payload.color,
    weight: payload.weight,
    birth_year: payload.birth_year ?? null,
  };

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
    birth_year: payload.birth_year?.trim() ? payload.birth_year : null,
  };

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

/** PUT /pets/{petId}/mbti */
export type UpdatePetMbtiRequest = {
  mbti: string;
};

export type UpdatePetMbtiResponse = {
  name?: string;
  birth_year?: string | null;
  weight?: number;
  color?: string;
  is_neutered?: boolean;
  gender?: "F" | "M";
  profile_image_url?: string | null;
  mbti?: string;
};

/**
 * 반려견 MBTI 변경
 * PUT /pets/{petId}/mbti
 */
export const updatePetMbti = (petId: string, mbti: string) =>
  apiPut<UpdatePetMbtiResponse>(`/pets/${petId}/mbti`, { mbti });

/**
 * 반려견 삭제
 * DELETE /pets/{petId}
 * 성공 시 본문 없음
 */
export const deletePet = (petId: string) =>
  apiDelete<void>(`/pets/${petId}`);

export const getCreatedPetId = (response: CreatePetResponse) =>
  response.pet_id;

/** GET /pets/progress — tracking_progress */
export type TrackingProgressDto = {
  code: string;
  walked_distance: number;
  required_distance: number;
  next_required_distance: number;
};

export type PetProgressDto = {
  pet_id: string;
  name: string;
  profile_image: string | null;
  tracking_progress: TrackingProgressDto;
};

export type PetProgressResponse = {
  pet_progresses: PetProgressDto[];
};

export type TrackingProgress = {
  code: string;
  walkedDistance: number;
  requiredDistance: number;
  nextRequiredDistance: number;
};

export type PetProgress = {
  petId: string;
  name: string;
  profileImageUrl: string | null;
  trackingProgress: TrackingProgress;
};

export const mapTrackingProgress = (
  dto: TrackingProgressDto,
): TrackingProgress => ({
  code: dto.code,
  walkedDistance: dto.walked_distance,
  requiredDistance: dto.required_distance,
  nextRequiredDistance: dto.next_required_distance,
});

export const mapPetProgress = (dto: PetProgressDto): PetProgress => ({
  petId: dto.pet_id,
  name: dto.name,
  profileImageUrl: dto.profile_image,
  trackingProgress: mapTrackingProgress(dto.tracking_progress),
});

/**
 * 반려견 산책 진행도 조회
 * GET /pets/progress
 *
 * - petIds 미전달: 소유 펫 전체 (펫 없으면 404)
 * - petIds 1건: ?petIds={UUID}
 * - petIds 여러 건: ?petIds={UUID1}&petIds={UUID2}
 * - 응답은 항상 배열, 중복 UUID는 1회만 반환, 요청 순서 유지
 * - 존재하지 않거나 타인 소유 UUID 포함 시 전체 실패
 */
export const getPetProgress = async (
  petIds?: string[],
): Promise<PetProgress[]> => {
  const uniquePetIds = petIds?.length
    ? [...new Set(petIds.filter(Boolean))]
    : [];

  const query = uniquePetIds.length
    ? `?${uniquePetIds.map((id) => `petIds=${encodeURIComponent(id)}`).join("&")}`
    : "";

  const response = await apiGet<PetProgressResponse>(`/pets/progress${query}`);
  return (response.pet_progresses ?? []).map(mapPetProgress);
};
