import { useRunStore } from "@/store/useRunStore";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import RouteSvg from "../svg/RouteSvg";
interface RouteItemProps {
  routeImgUrl?: string;
}

const RouteItem = ({ routeImgUrl }: RouteItemProps) => {
  const runData = useRunStore((state) => state.runData);
  const routeRef = useRef(null);
  const captureRoute = async () => {
    try {
      const uri = await captureRef(routeRef, {
        format: "png",
        quality: 1,
      });

      useRunStore.getState().addRunData({ routeImg: uri });
    } catch (error) {
      console.error("캡처 에러:", error);
    }
  };

  useEffect(() => {
    if (runData?.route && runData.route.length > 0 && !routeImgUrl) {
      const timeoutId = setTimeout(() => {
        captureRoute();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (runData?.route && runData.route.length > 0 && !routeImgUrl) {
    return (
      <View className="flex-1 items-center justify-center">
        <View
          ref={routeRef}
          collapsable={false}
          className="items-center justify-center rounded-xl bg-white p-4"
        >
          <RouteSvg />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={{ uri: routeImgUrl || "" }}
        style={{ height: "100%", aspectRatio: 4 / 5 }}
      />
    </View>
  );
};

export default RouteItem;
