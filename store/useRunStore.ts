import { create } from "zustand";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RunState {
  // 0. 추천 경로 리스트
  recommendedRoutes: Coordinate[][] | null;

  // 1. 추천 경로 (가이드 라인 - null이면 자유 러닝)
  selectedRoute: Coordinate[] | null;

  // 2. 실제 내가 뛴 경로 (기록용)
  actualRoute: Coordinate[][];

  // 3. 현재 내 위치 (지도 중심용)
  currentLocation: Coordinate | null;

  // 4. 러닝 상태
  isRunning: boolean;

  // 5. 페이스, 거리, 시간 등 러닝 관련 정보 (추후 확장 가능)
  runData?: {
    pace?: string; // min/km
    distance?: number; // m
    duration?: number; // s
    averagePace?: string; // min/km
    startTime?: number; // 타이머 시작 시간 (밀리초)
  };
  // 6. 일시정지 상태
  isPaused: boolean;

  setRecommendedRoutes: (routes: Coordinate[][] | null) => void;
  setSelectedRoute: (route: Coordinate[] | null) => void;
  setCurrentLocation: (location: Coordinate) => void;
  startRun: () => void;
  stopRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  addActualLocation: (location: Coordinate) => void;
  addRunData: (data: Partial<RunState["runData"]>) => void;
}

export const useRunStore = create<RunState>((set) => ({
  recommendedRoutes: null,
  selectedRoute: null,
  actualRoute: [[]],
  currentLocation: null,
  isRunning: false,
  runData: {
    pace: "0'00''",
    distance: 0,
    duration: 0,
    averagePace: "0'00''",
    startTime: undefined,
  },
  isPaused: false,

  setRecommendedRoutes: (routes) => set({ recommendedRoutes: routes }),

  setSelectedRoute: (route) => set({ selectedRoute: route }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  startRun: () =>
    set({
      isRunning: true,
      isPaused: false,
      actualRoute: [[]],
      runData: { ...useRunStore.getState().runData, startTime: Date.now() },
    }),

  stopRun: () =>
    set({
      isRunning: false,
      isPaused: false,
      actualRoute: [[]],
      runData: { ...useRunStore.getState().runData, startTime: undefined },
    }),

  addActualLocation: (location) =>
    set((state) => {
      if (!state.isRunning || state.isPaused) return state;

      const routes =
        state.actualRoute.length > 0 ? [...state.actualRoute] : [[]];
      const lastIndex = routes.length - 1;

      routes[lastIndex] = [...routes[lastIndex], location];
      return { actualRoute: routes };
    }),

  addRunData: (data: Partial<RunState["runData"]>) =>
    set((state) => ({
      runData: {
        ...(state.runData || {}),
        ...data,
      },
    })),

  pauseRun: () => set({ isPaused: true }),

  resumeRun: () =>
    set((state) => {
      const routes = [...state.actualRoute];
      const lastSegment = routes[routes.length - 1];
      if (lastSegment.length === 0 && lastSegment) {
        return { isPaused: false };
      }
      return { isPaused: false, actualRoute: [...routes, []] };
    }),
}));
