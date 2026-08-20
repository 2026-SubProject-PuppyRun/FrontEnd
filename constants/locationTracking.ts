import * as Location from "expo-location";

/** 백그라운드 산책 기록 */
export const RUN_LOCATION_TRACKING = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000,
  distanceInterval: 5,
} as const;

/**
 * 포그라운드 맵 watch
 * - 표시용은 자주 받고, 폴리라인 기록은 gpsFilter에서 걸러냄
 */
export const MAP_LOCATION_WATCH = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 800,
  distanceInterval: 1,
} as const;
