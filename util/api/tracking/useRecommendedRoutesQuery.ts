import { getCurrentPositionWithRetry } from "@/util/location";
import { useQuery } from "@tanstack/react-query";
import { syncLocationPermission } from "@/hooks/use-location-permission";
import { queryKeys } from "../core/queryKeys";
import {
  getTrackingRecommendations,
  mapTrackingRecommendations,
  type MappedRecommendedRoute,
} from "./api";

const RECOMMENDATION_RADIUS_METERS = 1000;
const RECOMMENDATION_LIMIT = 3;

type UseRecommendedRoutesQueryOptions = {
  enabled?: boolean;
};

/**
 * 현재 위치 기준 추천 산책 루트
 * GET /tracking/recommendations?latitude&longitude&radiusMeters=1000&limit=3
 */
export const useRecommendedRoutesQuery = ({
  enabled = true,
}: UseRecommendedRoutesQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.tracking.recommendations(
      RECOMMENDATION_RADIUS_METERS,
      RECOMMENDATION_LIMIT,
    ),
    queryFn: async (): Promise<MappedRecommendedRoute[]> => {
      const granted = await syncLocationPermission(true);
      if (!granted) {
        throw new Error("위치 권한이 필요합니다.");
      }

      const location = await getCurrentPositionWithRetry();
      const { latitude, longitude } = location.coords;

      const response = await getTrackingRecommendations({
        latitude,
        longitude,
        radiusMeters: RECOMMENDATION_RADIUS_METERS,
        limit: RECOMMENDATION_LIMIT,
      });

      return mapTrackingRecommendations(response);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
