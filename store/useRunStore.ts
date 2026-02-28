import { getPathLength } from "geolib";
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
    accumulatedMs?: number; // 일시정지 동안 누적된 시간 (밀리초)
    route?: Coordinate[] | null; // 최종 러닝 결과를 저장할 실제 경로
    totalTime?: number; // 총 러닝 시간 (초)
    selfie?: string | null; // 인증샷 URI
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
    accumulatedMs: 0,
    totalTime: 0,
    route: null,
  },
  isPaused: false,

  setRecommendedRoutes: (routes) => set({ recommendedRoutes: routes }),

  setSelectedRoute: (route) => set({ selectedRoute: route }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  startRun: () =>
    set((state) => ({
      isRunning: true,
      isPaused: false,
      runData: {
        ...state.runData,
        startTime: Date.now(),
        accumulatedMs: 0,
      },
    })),

  stopRun: () =>
    set((state) => {
      const currentStartTime = state.runData?.startTime;
      const accumulatedMs = state.runData?.accumulatedMs || 0;
      const activeMs = currentStartTime ? Date.now() - currentStartTime : 0;
      const totalTime = Math.floor((activeMs + accumulatedMs) / 1000);

      return {
        isRunning: false,
        isPaused: false,
        actualRoute: [[]],
        runData: {
          ...state.runData,
          totalTime,
          distance: getPathLength(state.actualRoute.flat()),
          route: state.actualRoute.flat(),
        },
      };
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

  pauseRun: () =>
    set((state) => {
      const currentStartTime = state.runData?.startTime ?? Date.now();
      const currentAccumulated = state.runData?.accumulatedMs ?? 0;
      const addedMs = Date.now() - currentStartTime;

      return {
        isPaused: true,
        runData: {
          ...state.runData,
          accumulatedMs: currentAccumulated + addedMs,
          startTime: undefined,
        },
      };
    }),

  resumeRun: () =>
    set((state) => {
      const routes = [...state.actualRoute];
      const lastSegment = routes[routes.length - 1];

      const newRunData = {
        ...state.runData,
        startTime: Date.now(),
      };

      if (lastSegment && lastSegment.length === 0) {
        return { isPaused: false, runData: newRunData };
      }
      return {
        isPaused: false,
        actualRoute: [...routes, []],
        runData: newRunData,
      };
    }),
}));
