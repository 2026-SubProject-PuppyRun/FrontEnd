import { getDistance } from "geolib";

export type GpsCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  speed?: number | null;
};

/** 이보다 나쁜(큰) accuracy면 무시 */
export const MAX_ACCURACY_M = 40;

/** 폴리라인 기록 최소 이동 — 표시와 분리해 지터만 강하게 막음 */
export const MIN_RECORD_DISTANCE_M = 10;

/** 마커 표시: 이보다 작으면 정지 지터로 보고 고정 */
export const MIN_MARKER_MOVE_M = 1.5;

/** 사실상 정지 속도 (m/s) */
export const STATIONARY_SPEED_MPS = 0.4;

/** 이동 중 마커 추종 EMA (클수록 빠름) */
const MOVING_EMA_ALPHA = 0.72;

/** 정지 근처 미세 이동 EMA */
const IDLE_EMA_ALPHA = 0.35;

let smoothedDisplay: { latitude: number; longitude: number } | null = null;

export const resetGpsFilter = () => {
  smoothedDisplay = null;
};

/** 초기 위치/현재위치 버튼 등으로 표시 기준점 강제 설정 */
export const seedDisplayCoords = (coords: {
  latitude: number;
  longitude: number;
}) => {
  smoothedDisplay = {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
  return smoothedDisplay;
};

export const isAccurateEnough = (coords: GpsCoords) =>
  coords.accuracy == null || coords.accuracy <= MAX_ACCURACY_M;

/**
 * 정지/노이즈 구간에서는 false.
 * lastPoint 기준으로 accuracy·속도·거리를 함께 본다.
 */
export const shouldAcceptRecordPoint = (
  coords: GpsCoords,
  lastPoint: { latitude: number; longitude: number } | null,
) => {
  if (!isAccurateEnough(coords)) return false;
  if (!lastPoint) return true;

  const distance = getDistance(lastPoint, coords);
  const noiseFloor = Math.max(
    MIN_RECORD_DISTANCE_M,
    (coords.accuracy ?? 12) * 0.7,
  );

  if (distance < noiseFloor) return false;

  if (
    coords.speed != null &&
    coords.speed >= 0 &&
    coords.speed < STATIONARY_SPEED_MPS &&
    distance < MIN_RECORD_DISTANCE_M * 1.6
  ) {
    return false;
  }

  return true;
};

/**
 * 맵 마커용 좌표.
 * 기록(폴리라인)보다 느슨하게 따라가 체감 지연을 줄인다.
 */
export const getSmoothedDisplayCoords = (
  coords: GpsCoords,
): { latitude: number; longitude: number } | null => {
  if (!isAccurateEnough(coords)) {
    return smoothedDisplay;
  }

  if (!smoothedDisplay) {
    smoothedDisplay = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    return smoothedDisplay;
  }

  const distance = getDistance(smoothedDisplay, coords);
  const isMoving =
    coords.speed == null || coords.speed >= STATIONARY_SPEED_MPS;

  // 정지 상태의 아주 작은 흔들림만 고정
  if (!isMoving && distance < MIN_MARKER_MOVE_M) {
    return smoothedDisplay;
  }

  const alpha = isMoving || distance >= 4 ? MOVING_EMA_ALPHA : IDLE_EMA_ALPHA;

  smoothedDisplay = {
    latitude:
      smoothedDisplay.latitude +
      alpha * (coords.latitude - smoothedDisplay.latitude),
    longitude:
      smoothedDisplay.longitude +
      alpha * (coords.longitude - smoothedDisplay.longitude),
  };
  return smoothedDisplay;
};
