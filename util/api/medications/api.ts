import type { MedicationDoseUnit } from "@/constants/medicationDoseUnits";
import type { MedicationRecord } from "@/types/medication";
import dayjs from "dayjs";
import { apiDelete, apiGet, apiPost, apiPut } from "../core/client";

export type MedicationLogDto = {
  medication_log_id: string;
  medication_name: string;
  administered_at: string;
  dose_amount: number;
  dose_unit: string;
  memo: string | null;
};

export type MedicationLogListResponse = {
  pet_id: string;
  total_medication_count: number;
  medication_log_list: MedicationLogDto[];
};

export type MedicationLogResponse = MedicationLogDto & {
  pet_id: string;
};

export type MedicationLogRequest = {
  medication_name: string;
  administered_at: string;
  dose_amount: number;
  dose_unit: string;
  memo?: string | null;
};

export const toAdministeredAt = (date: string, time: string) =>
  `${date}T${time.length === 5 ? `${time}:00` : time}`;

export const mapMedicationLogDto = (
  dto: MedicationLogDto,
  petId: string,
): MedicationRecord => {
  const administeredAt = dayjs(dto.administered_at);

  return {
    id: dto.medication_log_id,
    petId,
    date: administeredAt.format("YYYY-MM-DD"),
    time: administeredAt.format("HH:mm"),
    name: dto.medication_name,
    doseAmount: dto.dose_amount,
    doseUnit: dto.dose_unit,
    memo: dto.memo ?? undefined,
    administeredAt: dto.administered_at,
  };
};

export const toMedicationLogRequest = (
  values: {
    name: string;
    doseAmount: number;
    doseUnit: MedicationDoseUnit | string;
    date: string;
    time: string;
    memo?: string;
  },
  options?: { fullUpdate?: boolean },
): MedicationLogRequest => {
  const memo = values.memo?.trim();

  if (options?.fullUpdate) {
    return {
      medication_name: values.name.trim(),
      administered_at: toAdministeredAt(values.date, values.time),
      dose_amount: values.doseAmount,
      dose_unit: values.doseUnit,
      memo: memo || null,
    };
  }

  return {
    medication_name: values.name.trim(),
    administered_at: toAdministeredAt(values.date, values.time),
    dose_amount: values.doseAmount,
    dose_unit: values.doseUnit,
    ...(memo ? { memo } : {}),
  };
};

export type MappedMedicationLogs = {
  petId: string;
  totalCount: number;
  records: MedicationRecord[];
};

/**
 * 투약 기록 목록 조회
 * GET /pets/{petId}/medication-logs
 */
export const getMedicationLogs = async (
  petId: string,
): Promise<MappedMedicationLogs> => {
  const response = await apiGet<MedicationLogListResponse>(
    `/pets/${petId}/medication-logs`,
  );
  const resolvedPetId = response.pet_id || petId;
  const records = (response.medication_log_list ?? []).map((dto) =>
    mapMedicationLogDto(dto, resolvedPetId),
  );

  return {
    petId: resolvedPetId,
    totalCount: response.total_medication_count ?? records.length,
    records,
  };
};

/**
 * 투약 기록 등록
 * POST /pets/{petId}/medication-logs
 */
export const createMedicationLog = async (
  petId: string,
  request: MedicationLogRequest,
) => {
  const response = await apiPost<MedicationLogResponse>(
    `/pets/${petId}/medication-logs`,
    request,
  );
  return mapMedicationLogDto(response, response.pet_id ?? petId);
};

/**
 * 투약 기록 수정
 * PUT /pets/{petId}/medication-logs/{medicationLogId}
 */
export const updateMedicationLog = async (
  petId: string,
  medicationLogId: string,
  request: MedicationLogRequest,
) => {
  const response = await apiPut<MedicationLogResponse>(
    `/pets/${petId}/medication-logs/${medicationLogId}`,
    request,
  );
  return mapMedicationLogDto(response, response.pet_id ?? petId);
};

/**
 * 투약 기록 삭제
 * DELETE /pets/{petId}/medication-logs/{medicationLogId}
 */
export const deleteMedicationLog = (petId: string, medicationLogId: string) =>
  apiDelete<void>(`/pets/${petId}/medication-logs/${medicationLogId}`);
