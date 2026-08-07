import * as Location from "expo-location";

/** 백그라운드 산책 기록 */
export const RUN_LOCATION_TRACKING = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 3000,
  distanceInterval: 8,
} as const;

/** 포그라운드 맵 watch — 과도한 갱신으로 마커 지터 나지 않게 */
export const MAP_LOCATION_WATCH = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000,
  distanceInterval: 5,
} as const;
