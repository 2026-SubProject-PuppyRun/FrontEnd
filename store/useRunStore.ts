import { create } from "zustand";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RunState {
  // 1. 추천 경로 (가이드 라인 - null이면 자유 러닝)
  selectedRoute: Coordinate[] | null;

  // 2. 실제 내가 뛴 경로 (기록용)
  actualRoute: Coordinate[];

  // 3. 현재 내 위치 (지도 중심용)
  currentLocation: Coordinate | null;

  // 4. 러닝 상태
  isRunning: boolean;

  setSelectedRoute: (route: Coordinate[] | null) => void;
  setCurrentLocation: (location: Coordinate) => void;
  startRun: () => void;
  stopRun: () => void;
  addActualLocation: (location: Coordinate) => void;
}

export const useRunStore = create<RunState>((set) => ({
  selectedRoute: null,
  actualRoute: [],
  currentLocation: null,
  isRunning: false,

  setSelectedRoute: (route) => set({ selectedRoute: route }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  startRun: () => set({ isRunning: true, actualRoute: [] }),

  stopRun: () => set({ isRunning: false }),

  addActualLocation: (location) =>
    set((state) => {
      if (!state.isRunning) return state;
      return { actualRoute: [...state.actualRoute, location] };
    }),
}));
