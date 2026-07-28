import MyPageBody from "@/components/body/mypage/MyPageBody";
import Header, { HeaderIconButton } from "@/components/header/Header";
import { SettingsIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header
        showLogo
        right={
          <HeaderIconButton
            onPress={() => router.push("/mypage/settings")}
            accessibilityLabel="설정"
          >
            <SettingsIcon width={22} height={22} color="#0D0F1B" />
          </HeaderIconButton>
        }
      />
      <MyPageBody />
    </View>
  );
};

export default Index;
