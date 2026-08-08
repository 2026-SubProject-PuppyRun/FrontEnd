import { RUN_LOCATION_TRACKING } from "@/constants/locationTracking";
import { requestLocationPermission } from "@/hooks/use-location-permission";
import { LOCATION_TASK_NAME } from "@/tasks/backgroundLocationTask";
import { useRunStore } from "@/store/useRunStore";
import {
  bridgeLocationOnTransition,
  getTaskStopDelayMs,
} from "@/util/run/recordRunLocation";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { Alert, AppState, Linking } from "react-native";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const stopBackgroundTask = async () => {
  const hasTask =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasTask) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

const ensureForegroundPermission = async () => {
  const granted = await requestLocationPermission();
  return granted === true;
};

const ensureBackgroundPermission = async () => {
  const background = await Location.getBackgroundPermissionsAsync();
  if (background.status === "granted") return true;

  // 포그라운드가 먼저 있어야 Android/iOS 모두 백그라운드 요청 가능
  const hasForeground = await ensureForegroundPermission();
  if (!hasForeground) return false;

  if (!background.canAskAgain) {
    Alert.alert(
      "백그라운드 위치 권한",
      "화면을 끈 상태에서도 경로를 기록하려면 설정에서 위치를 '항상 허용'으로 바꿔 주세요.",
      [
        { text: "설정으로 이동", onPress: () => Linking.openSettings() },
        { text: "확인", style: "cancel" },
      ],
    );
    return false;
  }

  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") return true;

  Alert.alert(
    "백그라운드 위치 권한",
    "화면을 켠 상태에서는 경로가 기록됩니다. 백그라운드 기록이 필요하면 설정에서 '항상 허용'을 선택해 주세요.",
    [
      { text: "설정으로 이동", onPress: () => Linking.openSettings() },
      { text: "확인", style: "cancel" },
    ],
  );
  return false;
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
    if (!isRunning) return;

    const preparePermissions = async () => {
      await ensureForegroundPermission();
      await ensureBackgroundPermission();
    };

    void preparePermissions();
  }, [isRunning]);

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
