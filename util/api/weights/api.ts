import type { WeightRecord } from "@/types/weight";
import dayjs from "dayjs";
import { apiGet, apiPost } from "../core/client";

export type WeightLogDto = {
  weight_log_id: string;
  pet_id: string;
  weight: number;
  recorded_at: string;
};

/** 조회 응답 내 이력 항목 (id 없음) */
export type WeightLogListItem = {
  weight: number;
  recorded_at: string;
};

export type WeightLogListResponse = {
  pet_id: string;
  color?: string;
  current_weight?: number;
  total_weight_count?: number;
  weight_log_list: WeightLogListItem[];
};

export type WeightLogRequest = {
  weight: number;
};

export type MappedWeightLogs = {
  petId: string;
  totalCount: number;
  records: WeightRecord[];
};

export const mapWeightLogResponseDto = (
  dto: WeightLogDto,
  petId: string,
): WeightRecord => ({
  id: dto.weight_log_id,
  petId: dto.pet_id || petId,
  weight: dto.weight,
  measuredAt: dayjs(dto.recorded_at).format("YYYY-MM-DD"),
});

const mapWeightLogListItem = (
  item: WeightLogListItem,
  index: number,
  petId: string,
): WeightRecord => ({
  id: `weight-${petId}-${index}`,
  petId,
  weight: item.weight,
  measuredAt: dayjs(item.recorded_at).format("YYYY-MM-DD"),
});

/**
 * 몸무게 기록 목록 조회
 * GET /pets/weight-logs
 */
export const getWeightLogs = async (
  petId: string,
): Promise<MappedWeightLogs> => {
  const response = await apiGet<WeightLogListResponse>(
    `/pets/${petId}/weight-logs`,
  );
  return {
    petId,
    totalCount: response.total_weight_count ?? response.weight_log_list.length,
    records: response.weight_log_list.map((item, i) =>
      mapWeightLogListItem(item, i, petId),
    ),
  };
};

/**
 * 몸무게 기록 등록
 * POST /pets/weight-logs
 */
export const createWeightLog = async (
  petId: string,
  request: WeightLogRequest,
) => {
  const response = await apiPost<WeightLogDto>(
    `/pets/${petId}/weight-logs`,
    request,
  );
  return mapWeightLogResponseDto(response, petId);
};
