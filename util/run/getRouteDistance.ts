import { getPathLength } from "geolib";

type RoutePoint = { latitude: number; longitude: number };

/** pause 구간을 제외하고 세그먼트별 거리를 합산 */
export const getRouteDistanceMeters = (segments: RoutePoint[][]) =>
  segments.reduce(
    (sum, segment) => (segment.length >= 2 ? sum + getPathLength(segment) : sum),
    0,
  );
