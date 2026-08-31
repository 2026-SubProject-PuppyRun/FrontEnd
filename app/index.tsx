import { resolveAppRoute, type AppRoute } from "@/util/auth/resolveAuthRoute";
import { Redirect, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";

LogBox.ignoreLogs(["Open debugger"]);

type RouteState = "loading" | AppRoute;

const ROUTE_HREF = {
  home: "/(tabs)/home",
  auth: "/(auth)/auth",
  onboarding: "/(onboarding)/welcome",
} as const satisfies Record<Exclude<RouteState, "loading">, Href>;

const Index = () => {
  const [route, setRoute] = useState<RouteState>("loading");

  useEffect(() => {
    let cancelled = false;

    resolveAppRoute().then((nextRoute) => {
      if (cancelled) return;
      setRoute(nextRoute);
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

  return <Redirect href={ROUTE_HREF[route]} />;
};

export default Index;
