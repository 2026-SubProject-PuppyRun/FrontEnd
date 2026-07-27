import HomeDashBoard from "@/components/board/HomeDashBoard/HomeDashBoard";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  return (
    <View className="flex-1 justify-center bg-[#F7F7F7]">
      <View className="flex-row items-center px-6 pb-2 pt-3">
        <View className="flex-1 items-center">
          <RunLogoSvg width={160} height={42} />
        </View>
      </View>

      <View className="px-6 pb-3">
        <Text className="text-xl font-bold text-[#0D0F1B]">오늘의 산책</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          날씨와 산책 기록을 한눈에 확인해보세요
        </Text>
      </View>

      <HomeDashBoard />
    </View>
  );
};

export default Index;
