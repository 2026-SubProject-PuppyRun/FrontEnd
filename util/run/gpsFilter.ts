import { getDistance } from "geolib";

export type GpsCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  speed?: number | null;
};

/** 이보다 나쁜(큰) accuracy면 무시 */
export const MAX_ACCURACY_M = 35;

/** 폴리라인 기록 최소 이동 (실기기 GPS 흔들림 ~3–10m) */
export const MIN_RECORD_DISTANCE_M = 10;

/** 마커 표시 갱신 최소 이동 */
export const MIN_MARKER_MOVE_M = 5;

/** 사실상 정지 속도 (m/s) — 이하면 기록 억제 */
export const STATIONARY_SPEED_MPS = 0.45;

const EMA_ALPHA = 0.28;

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

  // 속도가 거의 0인데 점만 튀는 경우 차단
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
 * 작은 흔들림은 고정하고, 의미 있는 이동만 EMA로 따라간다.
 * 부정확한 fix는 이전 표시 좌표를 유지한다.
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
  if (distance < MIN_MARKER_MOVE_M) {
    return smoothedDisplay;
  }

  // 정지에 가까우면 마커를 붙잡아 둔다
  if (
    coords.speed != null &&
    coords.speed >= 0 &&
    coords.speed < STATIONARY_SPEED_MPS &&
    distance < MIN_MARKER_MOVE_M * 2
  ) {
    return smoothedDisplay;
  }

  smoothedDisplay = {
    latitude:
      smoothedDisplay.latitude +
      EMA_ALPHA * (coords.latitude - smoothedDisplay.latitude),
    longitude:
      smoothedDisplay.longitude +
      EMA_ALPHA * (coords.longitude - smoothedDisplay.longitude),
  };
  return smoothedDisplay;
};
