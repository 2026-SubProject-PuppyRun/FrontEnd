import { useRunStore } from "@/store/useRunStore";
import { calculatePace } from "@/util/calcPace";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("❌ [Background Task] Error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };

    if (locations && locations.length > 0) {
      locations.forEach((location) => {
        useRunStore.getState().addActualLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });

      const lastLocation = locations[locations.length - 1];
      const speed = lastLocation.coords.speed; // m/s 단위

      if (speed !== null && speed >= 0) {
        const currentPace = calculatePace(speed); // "5'30''" 형식

        useRunStore.getState().addRunData({
          pace: currentPace,
        });
      }
      console.log("📍 [Background Task] 위치 업데이트:", {
        latitude: lastLocation.coords.latitude,
        longitude: lastLocation.coords.longitude,
        speed: lastLocation.coords.speed,
        pace: useRunStore.getState().runData?.pace,
      });
    }
  }
});

export const useRunTracking = () => {
  const isRunning = useRunStore((state) => state.isRunning);

  useEffect(() => {
    const startLocationTracking = async () => {
      console.log("🔍 [Tracking Hook] 권한 및 작업 시작 확인 중...");
      console.log("🔍 [Tracking Hook] 현재 러닝 상태:", isRunning);

      const { status: backStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backStatus !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "앱 사용을 위해 위치 권한을 모두 허용해 주세요.",
          [
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
            { text: "취소", style: "cancel", onPress: () => {} },
          ],
        );
        return;
      }

      if (isRunning) {
        const hasTask =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log(
          "🔍 [Tracking Hook] 위치 추적 현재 상태:",
          hasTask ? "ON" : "OFF",
        );
        if (hasTask) {
          console.log("♻️ [Reset] 기존 Task를 종료하고 재시작합니다.");
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
        console.log("🚀 [Tracking Hook] 위치 추적 시작 (Start Update)");
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
          foregroundService: {
            notificationTitle: "PuppyRun",
            notificationBody: "러닝 중입니다. 안전하게 뛰세요!",
          },
        });
      } else {
        const hasTask =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasTask) {
          console.log("🛑 [Stop] 러닝 종료, 위치 추적 OFF");
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    };
    startLocationTracking();
  }, [isRunning]);
};
