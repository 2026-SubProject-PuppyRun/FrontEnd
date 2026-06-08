import * as Location from "expo-location";

export const RUN_LOCATION_TRACKING = {
  accuracy: Location.Accuracy.High,
  timeInterval: 2000,
  distanceInterval: 2,
} as const;

export const MAP_LOCATION_WATCH = {
  accuracy: Location.Accuracy.High,
  timeInterval: 1000,
  distanceInterval: 1,
} as const;
