import type { Pet } from "@/store/usePetStore";
import { apiGet, apiPost } from "../core/client";

/** 홈 '최근 산책 요약' 카드용 */
export type WalkSummaryStats = {
  time: string;
  distance: string;
  pace: string;
};

export type PetWalkSummary = {
  pet: Pet;
  stats: WalkSummaryStats;
};

export type RecentWalkSummariesResponse = {
  summaries: PetWalkSummary[];
};

/** 산책 기록 저장 요청 예시 */
export type SaveWalkRequest = {
  petIds: string[];
  startedAt: string;
  endedAt: string;
  route: { latitude: number; longitude: number }[];
  distanceMeters: number;
};

export type SaveWalkResponse = {
  walkId: string;
};

/**
 * 최근 산책 요약 목록 (홈 캐러셀)
 * @example
 * const { summaries } = await getRecentWalkSummaries();
 */
export const getRecentWalkSummaries = () =>
  apiGet<RecentWalkSummariesResponse>("/walks/recent-summaries");

/**
 * 산책 기록 저장 (러닝 서머리 → 서버)
 * @example
 * await saveWalk({ petIds: ["..."], route: [...], ... });
 */
export const saveWalk = (payload: SaveWalkRequest) =>
  apiPost<SaveWalkResponse>("/walks", payload);
