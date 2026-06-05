import * as Location from "expo-location";

export const RUN_LOCATION_TRACKING = {
  accuracy: Location.Accuracy.High,
  timeInterval: 2000,
  distanceInterval: 2,
} as const;
