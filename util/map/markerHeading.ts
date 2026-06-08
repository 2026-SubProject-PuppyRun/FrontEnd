import { getDistance, getRhumbLineBearing } from "geolib";

export type LatLng = {
  latitude: number;
  longitude: number;
};

const MIN_BEARING_DISTANCE_M = 2;

/** 이동 방향 우선, 정지 시 GPS heading 폴백 */
export const resolveMarkerHeading = (
  previous: LatLng | null,
  current: LatLng,
  gpsHeading?: number | null,
): number | null => {
  if (previous) {
    const movedMeters = getDistance(previous, current);
    if (movedMeters >= MIN_BEARING_DISTANCE_M) {
      return getRhumbLineBearing(previous, current);
    }
  }

  if (
    typeof gpsHeading === "number" &&
    Number.isFinite(gpsHeading) &&
    gpsHeading >= 0
  ) {
    return gpsHeading;
  }

  return null;
};

/** 350° → 10° 회전 시 shortest path */
export const getShortestAngleDelta = (from: number, to: number) => {
  let delta = ((to - from + 540) % 360) - 180;
  return delta;
};
