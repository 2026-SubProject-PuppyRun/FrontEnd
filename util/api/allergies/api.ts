import type { AllergyFormValues, AllergyRecord, AllergySeverity } from "@/types/allergy";
import { apiDelete, apiGet, apiPost, apiPut } from "../core/client";

export type AllergySeverityDto = "MILD" | "MODERATE" | "SEVERE";

export type AllergyDto = {
  allergy_id: string;
  pet_id?: string;
  allergen_name: string;
  symptom: string | null;
  severity: AllergySeverityDto | null;
  identified_at: string | null;
  is_active: boolean;
  memo: string | null;
};

export type AllergyListResponse = {
  pet_id: string;
  total_allergy_count: number;
  allergy_list: AllergyDto[];
};

export type MappedAllergyLogs = {
  petId: string;
  totalCount: number;
  records: AllergyRecord[];
};

const mapSeverityFromDto = (
  severity: AllergySeverityDto | null,
): AllergySeverity | undefined => {
  if (!severity) return undefined;
  const map: Record<AllergySeverityDto, AllergySeverity> = {
    MILD: "mild",
    MODERATE: "moderate",
    SEVERE: "severe",
  };
  return map[severity];
};

export const mapAllergyDto = (dto: AllergyDto, petId: string): AllergyRecord => ({
  id: dto.allergy_id,
  petId,
  allergen: dto.allergen_name,
  severity: mapSeverityFromDto(dto.severity),
  symptoms: dto.symptom ?? undefined,
  diagnosedAt: dto.identified_at,
  isActive: dto.is_active,
  memo: dto.memo ?? undefined,
});

export type AllergyRequest = {
  allergen_name: string;
  symptom?: string | null;
  severity?: AllergySeverityDto | null;
  identified_at?: string | null;
  is_active: boolean;
  memo?: string | null;
};

const mapSeverityToDto = (
  severity?: AllergySeverity,
): AllergySeverityDto | null => {
  if (!severity) return null;
  const map: Record<AllergySeverity, AllergySeverityDto> = {
    mild: "MILD",
    moderate: "MODERATE",
    severe: "SEVERE",
  };
  return map[severity];
};

export const toAllergyRequest = (values: AllergyFormValues): AllergyRequest => ({
  allergen_name: values.allergen.trim(),
  symptom: values.symptoms?.trim() || null,
  severity: mapSeverityToDto(values.severity),
  identified_at: values.diagnosedAt || null,
  is_active: values.isActive,
  memo: values.memo?.trim() || null,
});

/**
 * 알러지 삭제
 * DELETE /pets/{petId}/allergies/{allergyId}
 */
export const deleteAllergy = (petId: string, allergyId: string) =>
  apiDelete<void>(
    `/pets/${petId}/allergies/${encodeURIComponent(allergyId)}`,
  );

/**
 * 알러지 수정
 * PUT /pets/{petId}/allergies/{allergyId}
 */
export const updateAllergy = async (
  petId: string,
  allergyId: string,
  request: AllergyRequest,
): Promise<AllergyRecord> => {
  const response = await apiPut<AllergyDto>(
    `/pets/${petId}/allergies/${encodeURIComponent(allergyId)}`,
    request,
  );
  return mapAllergyDto(response, response.pet_id ?? petId);
};

/**
 * 알러지 등록
 * POST /pets/{petId}/allergies
 */
export const createAllergy = async (
  petId: string,
  request: AllergyRequest,
): Promise<AllergyRecord> => {
  const response = await apiPost<AllergyDto>(
    `/pets/${petId}/allergies`,
    request,
  );
  return mapAllergyDto(response, response.pet_id ?? petId);
};

/**
 * 알러지 목록 조회
 * GET /pets/{petId}/allergies
 */
export const getAllergies = async (petId: string): Promise<MappedAllergyLogs> => {
  const response = await apiGet<AllergyListResponse>(
    `/pets/${petId}/allergies`,
  );
  const resolvedPetId = response.pet_id || petId;

  return {
    petId: resolvedPetId,
    totalCount: response.total_allergy_count ?? response.allergy_list.length,
    records: response.allergy_list.map((dto) =>
      mapAllergyDto(dto, resolvedPetId),
    ),
  };
};
