import { useCustomToast } from "@/hooks/use-custom-toast";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";

const EXIT_INTERVAL_MS = 2000;

/**
 * Android: 스택이 없을 때 뒤로가기 두 번으로 앱 종료.
 * 첫 입력 시 토스트 안내.
 */
export const useDoubleBackToExit = () => {
  const navigation = useNavigation();
  const { showToast } = useCustomToast();
  const lastBackPressRef = useRef(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          return false;
        }

        const now = Date.now();
        if (now - lastBackPressRef.current < EXIT_INTERVAL_MS) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPressRef.current = now;
        showToast({ message: "한 번 더 누르면 종료됩니다." });
        return true;
      },
    );

    return () => subscription.remove();
  }, [navigation, showToast]);
};
