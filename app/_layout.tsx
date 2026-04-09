import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { initFCM } from "@/util/initFCM";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    initFCM();
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
