import { useRunStore } from "@/store/useRunStore";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import RouteSvg from "../svg/RouteSvg";

const RouteItem = () => {
  const runData = useRunStore((state) => state.runData);
  const routeRef = useRef(null);

  const captureRoute = async () => {
    try {
      const uri = await captureRef(routeRef, {
        format: "png",
        quality: 1,
      });

      console.log("캡처 완료! 임시 경로:", uri);
      useRunStore.getState().addRunData({ routeImg: uri });
    } catch (error) {
      console.error("캡처 에러:", error);
    }
  };

  useEffect(() => {
    captureRoute();
  }, []);

  if (runData?.route && runData.route.length > 0) {
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
      <Text>서버에서 가져온 PNG 이미지 화면</Text>
    </View>
  );
};

export default RouteItem;
