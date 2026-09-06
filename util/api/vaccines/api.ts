import type { VaccineFormValues, VaccineRecord } from "@/types/vaccine";
import { apiDelete, apiGet, apiPost, apiPut } from "../core/client";

export type VaccinationDto = {
  vaccination_id: string;
  pet_id?: string;
  vaccine_name: string;
  vaccinated_at: string;
  next_vaccination_date: string | null;
  hospital_name: string | null;
  memo: string | null;
};

export type VaccinationListResponse = {
  pet_id: string;
  total_vaccination_count: number;
  vaccination_list: VaccinationDto[];
};

export type MappedVaccineLogs = {
  petId: string;
  totalCount: number;
  records: VaccineRecord[];
};

export const mapVaccinationDto = (
  dto: VaccinationDto,
  petId: string,
): VaccineRecord => ({
  id: dto.vaccination_id,
  petId,
  name: dto.vaccine_name,
  vaccinatedAt: dto.vaccinated_at,
  nextVaccinationAt: dto.next_vaccination_date ?? "",
  hospitalName: dto.hospital_name ?? undefined,
  memo: dto.memo ?? undefined,
});

export type VaccinationRequest = {
  vaccine_name: string;
  vaccinated_at: string;
  next_vaccination_date?: string | null;
  hospital_name?: string | null;
  memo?: string | null;
};

export const toVaccinationRequest = (
  values: VaccineFormValues,
): VaccinationRequest => ({
  vaccine_name: values.name.trim(),
  vaccinated_at: values.vaccinatedAt,
  next_vaccination_date: values.nextVaccinationAt || null,
  hospital_name: values.hospitalName?.trim() || null,
  memo: values.memo?.trim() || null,
});

/**
 * 예방접종 삭제
 * DELETE /pets/{petId}/vaccinations/{vaccinationId}
 */
export const deleteVaccination = (petId: string, vaccinationId: string) =>
  apiDelete<void>(
    `/pets/${petId}/vaccinations/${encodeURIComponent(vaccinationId)}`,
  );

/**
 * 예방접종 수정
 * PUT /pets/{petId}/vaccinations/{vaccinationId}
 */
export const updateVaccination = async (
  petId: string,
  vaccinationId: string,
  request: VaccinationRequest,
): Promise<VaccineRecord> => {
  const response = await apiPut<VaccinationDto>(
    `/pets/${petId}/vaccinations/${encodeURIComponent(vaccinationId)}`,
    request,
  );
  return mapVaccinationDto(response, response.pet_id ?? petId);
};

/**
 * 예방접종 등록
 * POST /pets/vaccinations
 */
export const createVaccination = async (
  petId: string,
  request: VaccinationRequest,
): Promise<VaccineRecord> => {
  const response = await apiPost<VaccinationDto>(
    `/pets/${petId}/vaccinations`,
    request,
  );
  return mapVaccinationDto(response, response.pet_id ?? petId);
};

/**
 * 예방접종 목록 조회
 * GET /pets/vaccinations
 */
export const getVaccinations = async (
  petId: string,
): Promise<MappedVaccineLogs> => {
  const response = await apiGet<VaccinationListResponse>(
    `/pets/${petId}/vaccinations`,
  );
  const resolvedPetId = response.pet_id || petId;
  return {
    petId: resolvedPetId,
    totalCount:
      response.total_vaccination_count ?? response.vaccination_list.length,
    records: response.vaccination_list.map((dto) =>
      mapVaccinationDto(dto, resolvedPetId),
    ),
  };
};
