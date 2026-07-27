import RunResultBoard from "@/components/board/RunBoard/RunResultBoard";
import WriteDiaryButton from "@/components/button/WriteDiaryButton";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import SelfieAndRouteSwiper from "@/components/swiper/SelfieAndRouteSwiper";
import useNonNavbar from "@/hooks/use-non-navbar";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Selfie = () => {
  const insets = useSafeAreaInsets();

  useNonNavbar();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F7F7F7]">
      <View className="items-center pt-3">
        <RunLogoSvg width={189} height={50} />
      </View>

      <View className="flex-1 justify-center gap-0">
        <SelfieAndRouteSwiper />
        <RunResultBoard />
      </View>

      <WriteDiaryButton />
    </View>
  );
};

export default Selfie;
