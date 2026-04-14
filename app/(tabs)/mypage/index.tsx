import MyPageBody from "@/components/body/MyPageBody";
import Header from "@/components/header/Header";
import { Button, ButtonIcon } from "@/components/ui/button";
import { SettingsIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const Index = () => {
  const router = useRouter();
  return (
    <View className="flex-1">
      <Header title="로고">
        <Button
          size="lg"
          className=" items-center rounded-full bg-transparent p-3.5"
          onPress={() => router.push("/mypage/settings")}
        >
          <ButtonIcon className="h-6 w-6" as={SettingsIcon} />
        </Button>
      </Header>
      <MyPageBody />
    </View>
  );
};

export default Index;
