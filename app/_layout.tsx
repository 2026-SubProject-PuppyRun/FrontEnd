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
import { openPermissionModal } from "@/store/usePermissionModalStore";
import { useSyncAccountFromQuery } from "@/util/api/account";
import { useSyncPetListFromQuery } from "@/util/api/pets";
import { spoqaFontMap } from "@/util/fonts/spoqa";
import {
  getFirebaseMessaging,
  initFCM,
  registerPushConsentOnAllow,
  requestUserPermission,
  androidNotificationIcons,
} from "@/util/notification";
import notifee from "@notifee/react-native";
import { onMessage } from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** QueryClient 안에서 계정/펫 정보를 스토어에 동기화 */
const AppDataBootstrap = () => {
  useSyncAccountFromQuery(true);
  useSyncPetListFromQuery(true);
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

  // 스플래시가 끝난 뒤 알림 권한 요청 → 허용 시 최초 동의/토큰 등록
  useEffect(() => {
    if (showAnimatedSplash) return;

    let cancelled = false;
    let hasSyncedPushConsent = false;

    const syncPushConsentIfAllowed = async () => {
      if (hasSyncedPushConsent) return true;

      const enabled = await requestUserPermission();
      if (cancelled || !enabled) return false;

      try {
        await registerPushConsentOnAllow();
        hasSyncedPushConsent = true;
      } catch (error) {
        console.warn("알림 동의/FCM 토큰 등록 실패:", error);
      }
      return true;
    };

    const requestNotificationPermission = async () => {
      const registered = await syncPushConsentIfAllowed();
      if (cancelled || registered) return;

      const settings = await notifee.getNotificationSettings();
      if (cancelled) return;
      if (settings.authorizationStatus === 0) {
        openPermissionModal({
          kind: "notification",
          onConfirm: () => {
            Linking.openSettings();
          },
        });
      }
    };

    void requestNotificationPermission();

    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void syncPushConsentIfAllowed();
      }
    });

    return () => {
      cancelled = true;
      appStateSub.remove();
    };
  }, [showAnimatedSplash]);

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
            <PermissionAlert />
            {showAnimatedSplash ? (
              <AnimatedSplashScreen onFinish={onAnimatedSplashFinish} />
            ) : null}
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
