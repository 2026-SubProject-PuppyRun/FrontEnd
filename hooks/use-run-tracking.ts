import { LOCATION_TASK_NAME } from "@/tasks/backgroundLocationTask";
import { useRunStore } from "@/store/useRunStore";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { Alert, AppState, Linking, Platform } from "react-native";

const stopBackgroundTask = async () => {
  const hasTask =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasTask) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

export const useRunTracking = () => {
  const isRunning = useRunStore((state) => state.isRunning);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const syncBackgroundTask = async () => {
      if (!isRunning || appState === "active") {
        await stopBackgroundTask();
        return;
      }

      const foreground = await Location.getForegroundPermissionsAsync();
      if (foreground.status !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "위치 권한 필요",
            "산책 경로 기록을 위해 위치 권한을 허용해 주세요.",
            [
              { text: "설정으로 이동", onPress: () => Linking.openSettings() },
              { text: "취소", style: "cancel" },
            ],
          );
          return;
        }
      }

      const background = await Location.getBackgroundPermissionsAsync();
      if (background.status !== "granted") {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
      }

      const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      if (!isTaskDefined) {
        console.error(
          "❌ [Tracking] background task가 등록되지 않았습니다:",
          LOCATION_TASK_NAME,
        );
        return;
      }

      try {
        const hasTask =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasTask) return;

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 2,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true,
          ...(Platform.OS === "android"
            ? {
                foregroundService: {
                  notificationTitle: "PuppyRun",
                  notificationBody: "산책 중입니다.",
                },
              }
            : {}),
        });
      } catch (error) {
        console.error("❌ [Tracking] startLocationUpdatesAsync 실패:", error);
      }
    };

    void syncBackgroundTask();
  }, [isRunning, appState]);
};
