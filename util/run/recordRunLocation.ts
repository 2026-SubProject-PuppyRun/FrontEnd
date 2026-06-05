import { useRunStore } from "@/store/useRunStore";
import { calculatePaceFromDistanceAndTime } from "@/util/run/calcPace";
import { getDistance, getPathLength } from "geolib";
import { AppState } from "react-native";

export type LocationRecordSource = "watch" | "task";

type LocationCoords = {
  latitude: number;
  longitude: number;
  speed?: number | null;
};

const MIN_RECORD_DISTANCE_M = 2;
const TASK_STOP_DELAY_MS = 400;

let latestCoords: LocationCoords | null = null;

export const isAppForeground = () => AppState.currentState === "active";

export const getTaskStopDelayMs = () => TASK_STOP_DELAY_MS;

/** 포그라운드: watch만, 백그라운드: task만 기록 */
export const shouldRecordFromSource = (source: LocationRecordSource) => {
  const foreground = isAppForeground();
  return source === "watch" ? foreground : !foreground;
};

const getLastRecordedPoint = () => {
  const flat = useRunStore.getState().actualRoute.flat();
  return flat.length > 0 ? flat[flat.length - 1] : null;
};

const isFarEnoughFromLast = (coords: LocationCoords) => {
  const last = getLastRecordedPoint();
  if (!last) return true;
  return getDistance(last, coords) >= MIN_RECORD_DISTANCE_M;
};

const getElapsedRunSeconds = () => {
  const { runData, isPaused } = useRunStore.getState();
  if (isPaused || !runData?.startTime) return 0;
  return Math.floor(
    ((runData.accumulatedMs ?? 0) + (Date.now() - runData.startTime)) / 1000,
  );
};

const updatePaceFromRoute = () => {
  const flat = useRunStore.getState().actualRoute.flat();
  const distance = getPathLength(flat);
  const elapsed = getElapsedRunSeconds();
  if (distance <= 0 || elapsed <= 0) return;

  const pace = calculatePaceFromDistanceAndTime(distance, elapsed);
  useRunStore.getState().addRunData({ pace, averagePace: pace });
};

const appendLocation = (coords: LocationCoords) => {
  if (!isFarEnoughFromLast(coords)) return false;

  useRunStore.getState().addActualLocation({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });
  updatePaceFromRoute();
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
