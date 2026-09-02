import "@/tasks/backgroundLocationTask";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import PermissionAlert from "@/components/modal/PermissionAlert";
import AnimatedSplashScreen from "@/components/splash/AnimatedSplashScreen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useAuthTokenStore } from "@/store/useAuthTokenStore";
import { useSyncAccountFromQuery } from "@/util/api/account";
import { useSyncPetListFromQuery } from "@/util/api/pets";
import { spoqaFontMap } from "@/util/fonts/spoqa";
import {
  androidNotificationIcons,
  flushPendingPushConsent,
  getFirebaseMessaging,
  initFCM,
} from "@/util/notification";
import notifee from "@notifee/react-native";
import { onMessage } from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** 로그인 상태일 때만 계정/펫 정보를 스토어에 동기화 */
const AppDataBootstrap = () => {
  const accessToken = useAuthTokenStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  useSyncAccountFromQuery(isLoggedIn);
  useSyncPetListFromQuery(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    void flushPendingPushConsent().catch((error) => {
      console.warn("보류된 알림 동의 등록 실패:", error);
    });
  }, [isLoggedIn]);

  return null;
};

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [fontsLoaded, fontError] = useFonts(spoqaFontMap);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const fontsReady = fontsLoaded || Boolean(fontError);

  const onAnimatedSplashReady = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const onAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  useEffect(() => {
    if (showAnimatedSplash && fontsReady) {
      onAnimatedSplashReady();
    }
  }, [showAnimatedSplash, fontsReady, onAnimatedSplashReady]);

  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;

    if (Device.isDevice) {
      initFCM().catch((error) => {
        console.warn("FCM 초기화 실패:", error);
      });

      try {
        unsubscribeForeground = onMessage(
          getFirebaseMessaging(),
          async (remoteMessage) => {
            console.log("💌 [포그라운드] 수신됨:", remoteMessage);

            const channelId = await notifee.createChannel({
              id: "default",
              name: "Default Channel",
              importance: 4,
            });

            await notifee.displayNotification({
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              android: {
                channelId,
                ...androidNotificationIcons,
                pressAction: {
                  id: "default",
                },
              },
            });
          },
        );
      } catch (error) {
        console.warn("FCM 포그라운드 리스너 등록 실패:", error);
      }
    }

    return () => {
      unsubscribeForeground?.();
    };
  }, []);

  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="dark">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppDataBootstrap />
            <Stack screenOptions={{ headerShown: false }} />
            {showAnimatedSplash ? (
              <AnimatedSplashScreen onFinish={onAnimatedSplashFinish} />
            ) : null}
            <PermissionAlert />
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
