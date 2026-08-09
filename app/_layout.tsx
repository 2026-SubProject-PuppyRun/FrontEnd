import "@/tasks/backgroundLocationTask";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import PermissionAlert from "@/components/modal/PermissionAlert";
import AnimatedSplashScreen from "@/components/splash/AnimatedSplashScreen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DUMMY_PET_LIST } from "@/constants/dummyPetList";
import "@/global.css";
import { openPermissionModal } from "@/store/usePermissionModalStore";
import { usePetStore } from "@/store/usePetStore";
import { getFirebaseMessaging, initFCM } from "@/util/notification";
import notifee from "@notifee/react-native";
import { onMessage } from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const queryClient = new QueryClient();
  const setPetList = usePetStore((state) => state.setPetList);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const dummyBreedSignature = DUMMY_PET_LIST.map((p) => p.breedCode).join(",");

  const onAnimatedSplashReady = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const onAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  useEffect(() => {
    if (showAnimatedSplash) {
      onAnimatedSplashReady();
    }
  }, [showAnimatedSplash, onAnimatedSplashReady]);

  useEffect(() => {
    const fetchPetList = async () => {
      // Todo API 연동 — 연동 전까지 더미 데이터 사용
      setPetList(DUMMY_PET_LIST, DUMMY_PET_LIST.length);
    };
    fetchPetList();

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
                smallIcon: "notification_icon",
                color: "#F25857",
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
  }, [setPetList, dummyBreedSignature]);

  // 스플래시가 끝난 뒤 알림 권한 안내
  useEffect(() => {
    if (showAnimatedSplash) return;

    let cancelled = false;
    const requestNotificationPermission = async () => {
      const settings = await notifee.requestPermission();
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
    return () => {
      cancelled = true;
    };
  }, [showAnimatedSplash]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="dark">
          <GestureHandlerRootView style={{ flex: 1 }}>
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
