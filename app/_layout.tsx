import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { initFCM } from "@/util/initFCM";
import messaging from "@react-native-firebase/messaging"; // ★ 추가
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    initFCM();

    // ★ 포그라운드 리스너는 앱이 켜져있을 때 유지되도록 컴포넌트 안에서 등록!
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("💌 [포그라운드] 수신됨:", remoteMessage);
      // 여기서 Alert 띄우기 처리 등등...
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
