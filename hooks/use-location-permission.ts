import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, AppState, Linking } from "react-native";

export const useLocationPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkPermission = async () => {
    // 이미 확인 중이면 중복 실행 방지
    if (isChecking) return;
    setIsChecking(true);

    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "앱 사용을 위해 위치 권한을 허용해 주세요.",
          [
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
            { text: "취소", style: "cancel", onPress: () => setGranted(false) },
          ],
        );
        setGranted(false);
        setIsChecking(false);
        return;
      }

      setGranted(true);
    } catch (error) {
      console.error("위치 권한 오류:", error);
      setGranted(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // 초기 권한 확인 (한 번만)
    checkPermission();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // 앱이 foreground로 돌아올 때만 권한 재확인
      if (nextAppState === "active" && granted === false) {
        checkPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return granted;
};
