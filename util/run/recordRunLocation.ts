import { useRunStore } from "@/store/useRunStore";
import {
  calculatePace,
  calculatePaceFromDistanceAndTime,
} from "@/util/run/calcPace";
import { getRouteDistanceMeters } from "@/util/run/getRouteDistance";
import {
  resetGpsFilter,
  shouldAcceptRecordPoint,
  type GpsCoords,
} from "@/util/run/gpsFilter";
import { getPathLength } from "geolib";
import { AppState } from "react-native";

export type LocationRecordSource = "watch" | "task";

type LocationCoords = GpsCoords;

const TASK_STOP_DELAY_MS = 400;
const CURRENT_PACE_WINDOW_MS = 30_000;
const MIN_CURRENT_PACE_DISTANCE_M = 8;

type PaceSample = {
  latitude: number;
  longitude: number;
  recordedAt: number;
};

let latestCoords: LocationCoords | null = null;
let recentSamples: PaceSample[] = [];

export const isAppForeground = () => AppState.currentState === "active";

export const getTaskStopDelayMs = () => TASK_STOP_DELAY_MS;

export const resetPaceTracking = () => {
  latestCoords = null;
  recentSamples = [];
  resetGpsFilter();
};

/** 포그라운드: watch만, 백그라운드: task만 기록 */
export const shouldRecordFromSource = (source: LocationRecordSource) => {
  const foreground = isAppForeground();
  return source === "watch" ? foreground : !foreground;
};

const getLastRecordedPoint = () => {
  const flat = useRunStore.getState().actualRoute.flat();
  return flat.length > 0 ? flat[flat.length - 1] : null;
};

export const getElapsedRunSeconds = () => {
  const { runData, isPaused } = useRunStore.getState();
  const accumulatedMs = runData?.accumulatedMs ?? 0;

  if (isPaused) {
    return Math.floor(accumulatedMs / 1000);
  }

  if (!runData?.startTime) {
    return Math.floor(accumulatedMs / 1000);
  }

  return Math.floor(
    (accumulatedMs + (Date.now() - runData.startTime)) / 1000,
  );
};

const pruneRecentSamples = (now = Date.now()) => {
  recentSamples = recentSamples.filter(
    (sample) => now - sample.recordedAt <= CURRENT_PACE_WINDOW_MS,
  );
};

const pushRecentSample = (coords: LocationCoords) => {
  recentSamples.push({
    latitude: coords.latitude,
    longitude: coords.longitude,
    recordedAt: Date.now(),
  });
  pruneRecentSamples();
};

const calculateAveragePace = () => {
  const { actualRoute } = useRunStore.getState();
  const distance = getRouteDistanceMeters(actualRoute);
  const elapsed = getElapsedRunSeconds();

  if (distance <= 0 || elapsed <= 0) return "0'00''";
  return calculatePaceFromDistanceAndTime(distance, elapsed);
};

const calculateCurrentPace = (coords?: LocationCoords) => {
  const averagePace = calculateAveragePace();
  const now = Date.now();
  pruneRecentSamples(now);

  const windowSamples = recentSamples;
  if (windowSamples.length >= 2) {
    const distance = getPathLength(windowSamples);
    const elapsedSec =
      (windowSamples[windowSamples.length - 1].recordedAt -
        windowSamples[0].recordedAt) /
      1000;

    if (distance >= MIN_CURRENT_PACE_DISTANCE_M && elapsedSec > 0) {
      return calculatePaceFromDistanceAndTime(distance, elapsedSec);
    }
  }

  const speed = coords?.speed ?? latestCoords?.speed;
  if (speed != null && speed > 0.5) {
    return calculatePace(speed);
  }

  return averagePace;
};

/** 러닝 중 페이스·거리 지표 갱신 (GPS 수신 또는 1초 tick) */
export const updateRunPaceMetrics = (coords?: LocationCoords) => {
  const { isRunning, isPaused } = useRunStore.getState();
  if (!isRunning || isPaused) return;

  const averagePace = calculateAveragePace();
  const currentPace = calculateCurrentPace(coords);
  const distance = getRouteDistanceMeters(useRunStore.getState().actualRoute);

  useRunStore.getState().addRunData({
    pace: currentPace,
    averagePace,
    distance,
  });
};

const appendLocation = (coords: LocationCoords) => {
  if (!shouldAcceptRecordPoint(coords, getLastRecordedPoint())) return false;

  useRunStore.getState().addActualLocation({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });
  pushRecentSample(coords);
  updateRunPaceMetrics(coords);
  return true;
};

/** AppState 전환 시 마지막 좌표로 경로 공백 보정 */
export const bridgeLocationOnTransition = () => {
  if (!latestCoords) return;

  const { isRunning, isPaused } = useRunStore.getState();
  if (!isRunning || isPaused) return;

  appendLocation(latestCoords);
};

/** 러닝 중 위치 1건을 actualRoute·페이스에 반영 */
export const recordRunLocation = (
  coords: LocationCoords,
  source: LocationRecordSource,
) => {
  latestCoords = coords;

  if (!shouldRecordFromSource(source)) return;

  const { isRunning, isPaused } = useRunStore.getState();
  if (!isRunning || isPaused) return;

  appendLocation(coords);
};
