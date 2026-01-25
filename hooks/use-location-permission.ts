import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
export const useLocationPermission = async () => {
  try {
    let { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      Alert.alert(
        "위치 권한이 필요",
        "앱을 사용하려면 위치 권한을 허용해주세요.",
        [
          { text: "설정으로 이동", onPress: () => Linking.openSettings() },
          { text: "취소", style: "cancel" },
        ],
      );
      return false;
    }
  } catch (error) {
    console.error("위치 권한 요청 중 오류 발생:", error);
    return false;
  }

  try {
    let { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      Alert.alert(
        "백그라운드 위치 권한이 필요",
        "앱이 백그라운드에서 위치를 추적하려면 백그라운드 위치 권한을 허용해주세요.",
        [
          { text: "설정으로 이동", onPress: () => Linking.openSettings() },
          { text: "취소", style: "cancel" },
        ],
      );
      return false;
    }
  } catch (error) {
    console.error("백그라운드 위치 권한 요청 중 오류 발생:", error);
    return false;
  }

  return true;
};
