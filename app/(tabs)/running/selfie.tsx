import RunResultBoard from "@/components/board/RunResultBoard";
import Header from "@/components/header/Header";
import SelfieAndRouteSwiper from "@/components/swiper/SelfieAndRouteSwiper";
import useNonNavbar from "@/hooks/use-non-navbar";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Selfie = () => {
  const insets = useSafeAreaInsets();
  useNonNavbar();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      <Header />
      <SelfieAndRouteSwiper />
      <RunResultBoard />
    </View>
  );
};

export default Selfie;
