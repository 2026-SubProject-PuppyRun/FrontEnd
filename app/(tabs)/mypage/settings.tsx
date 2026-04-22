import SettingBody from "@/components/body/mypage/SettingBody";
import Header from "@/components/header/Header";
import React from "react";
import { View } from "react-native";

const Settings = () => {
  return (
    <View className="flex-1">
      <Header title="설정" />
      <SettingBody />
    </View>
  );
};

export default Settings;
