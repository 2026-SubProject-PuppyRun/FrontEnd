import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { paddingTop: insets.top },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="basics" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="health" />
    </Stack>
  );
}
