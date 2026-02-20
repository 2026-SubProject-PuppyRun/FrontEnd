import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
        },
      }}
    >
      <Tabs.Screen
        name="care"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="paw" size={24} color={focused ? "blue" : "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="running"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="walk"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
          href: "/(tabs)/running",
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={24}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Tabs.Screen name="mypage" options={{ href: null }} />
    </Tabs>
  );
}
