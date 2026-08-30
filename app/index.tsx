import { restoreAuthSession } from "@/util/auth/restoreSession";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";

LogBox.ignoreLogs(["Open debugger"]);

type AuthRoute = "loading" | "home" | "auth";

const Index = () => {
  const [route, setRoute] = useState<AuthRoute>("loading");

  useEffect(() => {
    let cancelled = false;

    restoreAuthSession().then((isLoggedIn) => {
      if (cancelled) return;
      setRoute(isLoggedIn ? "home" : "auth");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (route === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5EFE8]">
        <ActivityIndicator color="#F25857" />
      </View>
    );
  }

  return (
    <Redirect href={route === "home" ? "/(tabs)/home" : "/(auth)/auth"} />
  );
};

export default Index;
