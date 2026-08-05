import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import HomeSummarySwiper from "../../swiper/HomeSummarySwiper";
import WalkScoreBoard from "./WalkScoreBoard";

const HomeDashBoard = () => {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HomeSummarySwiper />

      <View className="mb-2 flex-row gap-3 px-6">
        <Pressable
          onPress={() => router.push("/(tabs)/home/status")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-[#F25857] py-4 shadow-sm"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Ionicons name="bar-chart-outline" size={18} color="#fff" />
          <Text className="text-sm font-semibold text-white">통계 보기</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/home/alarm")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-white py-4 shadow-sm"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Ionicons name="alarm-outline" size={18} color="#0D0F1B" />
          <Text className="text-sm font-semibold text-[#0D0F1B]">
            알람 설정
          </Text>
        </Pressable>
      </View>

      <WalkScoreBoard />
    </ScrollView>
  );
};

export default HomeDashBoard;
