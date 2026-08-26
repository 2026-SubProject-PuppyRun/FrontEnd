import type { Pet } from "@/store/usePetStore";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { queryKeys } from "../core/queryKeys";
import {
  getPetLastTrackings,
  type PetLastTrackingActivity,
  type PetLastTrackingItem,
} from "./api";

export const PET_LAST_TRACKING_RANGE_DAYS = 89;

export type WalkSummaryStats = {
  time: string;
  distance: string;
  pace: string;
};

export type PetWalkSummaryCard = {
  pet: Pet;
  stats: WalkSummaryStats;
  trackingId: string | null;
};

const EMPTY_WALK_STATS: WalkSummaryStats = {
  time: "00:00:00",
  distance: "0.0 km",
  pace: "0'00\"",
};

const formatWalkTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const formatDistanceKm = (meters: number) => {
  const km = meters / 1000;
  const value = km >= 10 ? Math.round(km).toString() : km.toFixed(1);
  return `${value} km`;
};

const formatPace = (pace: string) => {
  if (!pace) return "0'00\"";
  if (pace.endsWith('"') || pace.endsWith("''")) return pace;
  return `${pace}"`;
};

export const mapActivityToStats = (
  activity: PetLastTrackingActivity | null,
): WalkSummaryStats => {
  if (!activity) return EMPTY_WALK_STATS;

  return {
    time: formatWalkTime(activity.duration_sec),
    distance: formatDistanceKm(activity.distance_m),
    pace: formatPace(activity.average_pace),
  };
};

const FALLBACK_PET_COLOR = "#F25857";
const FALLBACK_BREED_CODE = "000";

/** API 활동 + 스토어 펫 → 카드용 Pet */
export const resolvePetForSummary = (
  activity: PetLastTrackingItem,
  petList: Pet[] | null | undefined,
): Pet => {
  const stored = petList?.find((pet) => pet.petId === activity.pet_id);
  if (stored) {
    return {
      ...stored,
      name: stored.name || activity.pet_name,
      profileImageUrl:
        stored.profileImageUrl ?? activity.pet_profile_url ?? null,
    };
  }

  return {
    petId: activity.pet_id,
    name: activity.pet_name,
    profileImageUrl: activity.pet_profile_url,
    color: FALLBACK_PET_COLOR,
    breedCode: FALLBACK_BREED_CODE,
    badgeCode: "000",
    birthYear: null,
    weight: 0,
  };
};

export const mapPetLastTrackingsToSummaries = (
  activities: PetLastTrackingItem[],
  petList: Pet[] | null | undefined,
): PetWalkSummaryCard[] =>
  activities.map((item) => ({
    pet: resolvePetForSummary(item, petList),
    stats: mapActivityToStats(item.latest_activity),
    trackingId: item.latest_activity?.tracking_id ?? null,
  }));

/** 펫별 최근 산책 요약 (홈 카드) */
export const usePetLastTrackingQuery = (enabled = true) => {
  const endDate = dayjs().format("YYYY-MM-DD");
  const startDate = dayjs()
    .subtract(PET_LAST_TRACKING_RANGE_DAYS - 1, "day")
    .format("YYYY-MM-DD");

  return useQuery({
    queryKey: queryKeys.activityTracking.petLastTracking(startDate, endDate),
    queryFn: async () => {
      console.log("[petLastTracking] request", { startDate, endDate });
      try {
        const response = await getPetLastTrackings(startDate, endDate);
        console.log(
          "[petLastTracking] response",
          JSON.stringify(response, null, 2),
        );
        return response;
      } catch (error) {
        console.log("[petLastTracking] error", error);
        throw error;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};
