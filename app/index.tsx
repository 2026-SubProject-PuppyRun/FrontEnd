import { Redirect } from "expo-router";
import React from "react";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Open debugger"]);

const Index = () => {
  const isLoggedIn = false;
  return <Redirect href={isLoggedIn ? "/(tabs)/home" : "/(auth)/onboarding"} />;
};

export default Index;
