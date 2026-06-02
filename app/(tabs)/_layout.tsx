import CustomTabBar from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PILL_HEIGHT = 64;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = PILL_HEIGHT + Math.max(insets.bottom, 10) + 8;

  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="care" />
      <Tabs.Screen name="running" options={{ href: "/(tabs)/running" }} />
      <Tabs.Screen name="home" options={{ href: "/(tabs)/home" }} />
      <Tabs.Screen name="guide" options={{ href: "/(tabs)/guide" }} />
      <Tabs.Screen name="mypage" options={{ href: null }} />
    </Tabs>
  );
}
