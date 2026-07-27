import MyPageBody from "@/components/body/mypage/MyPageBody";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import { SettingsIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <View className="flex-row items-center px-6 pb-2 pt-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
        >
          <Ionicons name="chevron-back" size={28} color="#0D0F1B" />
        </Pressable>
        <View className="flex-1 items-center">
          <RunLogoSvg width={160} height={42} />
        </View>
        <Pressable
          onPress={() => router.push("/mypage/settings")}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          accessibilityRole="button"
          accessibilityLabel="설정"
        >
          <SettingsIcon width={22} height={22} color="#0D0F1B" />
        </Pressable>
      </View>
      <MyPageBody />
    </View>
  );
};

export default Index;
