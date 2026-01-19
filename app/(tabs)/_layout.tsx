import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen name="care" />
      <Tabs.Screen name="running" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="guide" />
    </Tabs>
  );
}
