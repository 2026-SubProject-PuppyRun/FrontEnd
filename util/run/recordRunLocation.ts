import { useRunStore } from "@/store/useRunStore";
import { calculatePace } from "@/util/run/calcPace";
import { AppState } from "react-native";

export type LocationRecordSource = "watch" | "task";

type LocationCoords = {
  latitude: number;
  longitude: number;
  speed?: number | null;
};

export const isAppForeground = () => AppState.currentState === "active";

/** 포그라운드: watch만, 백그라운드: task만 기록 */
export const shouldRecordFromSource = (source: LocationRecordSource) => {
  const foreground = isAppForeground();
  return source === "watch" ? foreground : !foreground;
};

/** 러닝 중 위치 1건을 actualRoute·페이스에 반영 */
export const recordRunLocation = (
  coords: LocationCoords,
  source: LocationRecordSource,
) => {
  if (!shouldRecordFromSource(source)) return;

  const { isRunning, isPaused } = useRunStore.getState();
  if (!isRunning || isPaused) return;

  useRunStore.getState().addActualLocation({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  if (coords.speed != null && coords.speed >= 0) {
    useRunStore.getState().addRunData({
      pace: calculatePace(coords.speed),
    });
  }
};
