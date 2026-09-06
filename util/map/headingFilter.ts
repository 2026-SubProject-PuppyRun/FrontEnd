import { getShortestAngleDelta } from "@/util/map/markerHeading";

/** 각도 저역통과 (최단 경로 기준) */
export const smoothHeading = (
  previous: number,
  next: number,
  alpha: number,
) => {
  const delta = getShortestAngleDelta(previous, next);
  return (previous + alpha * delta + 360) % 360;
};

/** deadzone 이내면 이전 값 유지 */
export const applyHeadingDeadzone = (
  previous: number,
  next: number,
  deadzoneDeg: number,
) => {
  const delta = Math.abs(getShortestAngleDelta(previous, next));
  return delta < deadzoneDeg ? previous : next;
};
