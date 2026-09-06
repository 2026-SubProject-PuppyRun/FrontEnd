import WriteDiaryButton from "@/components/button/WriteDiaryButton";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import SelfieRouteCard from "@/components/swiper/SelfieRouteCard";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunStore } from "@/store/useRunStore";
import { getRunResultStats } from "@/util/run/getRunResultStats";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Selfie = () => {
  const insets = useSafeAreaInsets();
  const runData = useRunStore((state) => state.runData);
  const { distanceKm, totalTimeLabel, paceLabel } = getRunResultStats(runData);

  useNonNavbar();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F7F7F7]">
      <View className="items-center pt-3">
        <RunLogoSvg width={189} height={50} />
      </View>

      <View className="flex-1 justify-center">
        <SelfieRouteCard
          stats={{
            pace: paceLabel,
            distanceLabel: `${distanceKm}km`,
            timeLabel: totalTimeLabel,
          }}
        />
      </View>

      <WriteDiaryButton />
    </View>
  );
};

export default Selfie;
