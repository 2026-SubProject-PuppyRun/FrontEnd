import { Redirect } from "expo-router";
import React from "react";

const Index = () => {
  const isLoggedIn = true;
  return <Redirect href={isLoggedIn ? "/(tabs)/home" : "/(auth)/login"} />;
};

export default Index;
