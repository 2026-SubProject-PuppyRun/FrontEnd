import { calculatePaceFromDistanceAndTime } from "@/util/run/calcPace";
import { getRouteDistanceMeters } from "@/util/run/getRouteDistance";
import { resetPaceTracking } from "@/util/run/recordRunLocation";
import { create } from "zustand";

interface Coordinate {
  latitude: number;
  longitude: number;
}

const EMPTY_RUN_DATA = {
  pace: "0'00''",
  distance: 0,
  duration: 0,
  averagePace: "0'00''",
  startTime: undefined as number | undefined,
  accumulatedMs: 0,
  route: null as Coordinate[] | null,
  routeImg: null as string | null,
  selfie: null as string | null,
  totalTime: 0,
  stopTime: null as Date | null,
  title: "",
  contents: "",
  /** 서버 트래킹 기록 ID — 일기 등록 시 필요 */
  trackingId: null as string | null,
};

interface RunState {
  recommendedRoutes: Coordinate[][] | null;
  selectedRoute: Coordinate[] | null;
  actualRoute: Coordinate[][];
  currentLocation: Coordinate | null;
  isRunning: boolean;
  runData: typeof EMPTY_RUN_DATA;
  isPaused: boolean;

  setRecommendedRoutes: (routes: Coordinate[][] | null) => void;
  setSelectedRoute: (route: Coordinate[] | null) => void;
  setCurrentLocation: (location: Coordinate) => void;
  startRun: () => void;
  stopRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  addActualLocation: (location: Coordinate) => void;
  addRunData: (data: Partial<typeof EMPTY_RUN_DATA>) => void;
  resetRunData: () => void;
  resetRunSession: () => void;
  submitRunData: (title: string, contents: string) => Promise<void>;
}

export const useRunStore = create<RunState>((set) => ({
  recommendedRoutes: null,
  selectedRoute: null,
  actualRoute: [[]],
  currentLocation: null,
  isRunning: false,
  runData: { ...EMPTY_RUN_DATA },
  isPaused: false,

  setRecommendedRoutes: (routes) => set({ recommendedRoutes: routes }),

  setSelectedRoute: (route) => set({ selectedRoute: route }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  startRun: () => {
    resetPaceTracking();
    set({
      isRunning: true,
      isPaused: false,
      actualRoute: [[]],
      runData: {
        ...EMPTY_RUN_DATA,
        startTime: Date.now(),
      },
    });
  },

  stopRun: () =>
    set((state) => {
      const currentStartTime = state.runData?.startTime;
      const accumulatedMs = state.runData?.accumulatedMs || 0;
      const activeMs = currentStartTime ? Date.now() - currentStartTime : 0;
      const totalTime = Math.floor((activeMs + accumulatedMs) / 1000);
      const distance = getRouteDistanceMeters(state.actualRoute);
      const averagePace =
        distance > 0 && totalTime > 0
          ? calculatePaceFromDistanceAndTime(distance, totalTime)
          : "0'00''";

      resetPaceTracking();

      return {
        isRunning: false,
        isPaused: false,
        actualRoute: [[]],
        runData: {
          ...(state.runData ?? EMPTY_RUN_DATA),
          totalTime,
          distance,
          pace: averagePace,
          averagePace,
          route: state.actualRoute.flat(),
          stopTime: new Date(),
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

  addRunData: (data: Partial<typeof EMPTY_RUN_DATA>) =>
    set((state) => ({
      runData: {
        ...(state.runData || EMPTY_RUN_DATA),
        ...data,
      },
    })),

  resetRunData: () =>
    set((state) => ({
      runData: { ...EMPTY_RUN_DATA },
    })),

  resetRunSession: () => {
    resetPaceTracking();
    set({
      isRunning: false,
      isPaused: false,
      actualRoute: [[]],
      runData: { ...EMPTY_RUN_DATA },
    });
  },

  pauseRun: () =>
    set((state) => {
      const currentStartTime = state.runData?.startTime ?? Date.now();
      const currentAccumulated = state.runData?.accumulatedMs ?? 0;
      const addedMs = Date.now() - currentStartTime;

      return {
        isPaused: true,
        runData: {
          ...(state.runData ?? EMPTY_RUN_DATA),
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
        ...(state.runData ?? EMPTY_RUN_DATA),
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

  submitRunData: async (title, contents) => {
    const { runData } = useRunStore.getState();
    if (!runData?.route?.length) {
      throw new Error("No run data to submit");
    }
    // TODO: API 연동 후 서버 저장
    console.log("submitData :", { ...runData, title, contents });
  },
}));
