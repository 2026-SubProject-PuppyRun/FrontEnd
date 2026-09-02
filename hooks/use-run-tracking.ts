import { RUN_LOCATION_TRACKING } from "@/constants/locationTracking";
import { requestLocationPermission } from "@/hooks/use-location-permission";
import { openPermissionModal } from "@/store/usePermissionModalStore";
import { LOCATION_TASK_NAME } from "@/tasks/backgroundLocationTask";
import { useRunStore } from "@/store/useRunStore";
import {
  bridgeLocationOnTransition,
  getTaskStopDelayMs,
} from "@/util/run/recordRunLocation";
import { useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Linking } from "react-native";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const stopBackgroundTask = async () => {
  const hasTask =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasTask) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

let didPromptBackgroundThisSession = false;

const ensureForegroundPermission = async () => {
  const granted = await requestLocationPermission();
  return granted === true;
};

const promptBackgroundSettings = () => {
  openPermissionModal({
    kind: "backgroundLocation",
    onConfirm: () => Linking.openSettings(),
    onCancel: () => {
      didPromptBackgroundThisSession = false;
    },
  });
};

export const ensureBackgroundPermission = async (
  options: { forcePrompt?: boolean } = {},
) => {
  const background = await Location.getBackgroundPermissionsAsync();
  if (background.status === "granted") {
    didPromptBackgroundThisSession = false;
    return true;
  }

  // 포그라운드가 먼저 있어야 Android/iOS 모두 백그라운드 요청 가능
  const hasForeground = await ensureForegroundPermission();
  if (!hasForeground) return false;

  if (!options.forcePrompt && didPromptBackgroundThisSession) return false;

  didPromptBackgroundThisSession = true;

  if (!background.canAskAgain) {
    promptBackgroundSettings();
    return false;
  }

  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    didPromptBackgroundThisSession = false;
    return true;
  }

  promptBackgroundSettings();
  return false;
};

/** 러닝 탭 진입 시 백그라운드(항상 허용) 위치 권한을 요청합니다. */
export const usePromptBackgroundLocationOnFocus = () => {
  useFocusEffect(
    useCallback(() => {
      void ensureBackgroundPermission();
    }, []),
  );
};

export const useRunTracking = () => {
  const isRunning = useRunStore((state) => state.isRunning);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (useRunStore.getState().isRunning) {
        bridgeLocationOnTransition();
      }
      setAppState(nextState);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const syncBackgroundTask = async () => {
      if (!isRunning || appState === "active") {
        if (isRunning && appState === "active") {
          bridgeLocationOnTransition();
          await delay(getTaskStopDelayMs());
        }
        await stopBackgroundTask();
        return;
      }

      const hasForeground = await ensureForegroundPermission();
      if (!hasForeground) return;

      const hasBackground = await ensureBackgroundPermission();
      if (!hasBackground) return;

      const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      if (!isTaskDefined) {
        Alert.alert(
          "위치 추적 오류",
          "백그라운드 위치 작업이 등록되지 않았습니다. 앱을 다시 시작해 주세요.",
        );
        return;
      }

      try {
        const hasTask =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasTask) return;

        bridgeLocationOnTransition();

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          ...RUN_LOCATION_TRACKING,
          pausesUpdatesAutomatically: false,
          foregroundService: {
            notificationTitle: "PuppyRun",
            notificationBody: "산책 중입니다.",
          },
        });
      } catch (error) {
        console.error("❌ [Tracking] startLocationUpdatesAsync 실패:", error);
        Alert.alert(
          "위치 추적 실패",
          "백그라운드 경로 기록을 시작하지 못했습니다. 위치 권한과 GPS 설정을 확인해 주세요.",
        );
      }
    };

    void syncBackgroundTask();
  }, [isRunning, appState]);
};
