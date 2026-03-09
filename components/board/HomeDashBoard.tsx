import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native"; // Platform 임포트 추가
import { Button, ButtonText } from "../ui/button";
import RunSummaryBoard from "./HomeDashBoardItem/RunSummaryBoard";
import WalkScoreBoard from "./HomeDashBoardItem/WalkScoreBoard";

const HomeDashBoard = () => {
  const router = useRouter();
  return (
    <ScrollView className="bg-gray-100">
      <RunSummaryBoard />
      <View className="flex-row items-center justify-start gap-4 px-4 py-2">
        <View className="rounded-lg " style={{ elevation: 5 }}>
          <Button
            size="xl"
            className="rounded-lg bg-[#737153] data-[active=true]:bg-[#BFB8AA] "
            onPress={() => router.push("/(tabs)/home/status")}
          >
            <ButtonText className="text-white">통계 보기</ButtonText>
          </Button>
        </View>

        <View className="rounded-lg " style={{ elevation: 5 }}>
          <Button
            size="xl"
            className="rounded-lg bg-[#737153] data-[active=true]:bg-[#BFB8AA] "
            onPress={() => router.push("/(tabs)/home/alarm")}
          >
            <ButtonText className="text-white">알람 설정하기</ButtonText>
          </Button>
        </View>
      </View>
      <WalkScoreBoard />
    </ScrollView>
  );
};

export default HomeDashBoard;
