import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { initFCM } from "@/util/initFCM";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging"; // ★ 추가
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useEffect } from "react";
export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    async function requestNotificationPermission() {
      await notifee.requestPermission();
    }
    requestNotificationPermission();

    if (Device.isDevice) {
      initFCM();
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
          smallIcon: "ic_launcher",
          pressAction: {
            id: "default",
          },
        },
      });
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="dark">
          <Stack screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
