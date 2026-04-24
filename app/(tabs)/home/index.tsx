import HomeAvatar from "@/components/avatar/HomeAvatar";
import HomeDashBoard from "@/components/board/HomeDashBoard/HomeDashBoard";
import Header from "@/components/header/Header";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  return (
    <View>
      <Header disableBack={true}>
        <Text className="flex-1 self-center">로고</Text>
        <HomeAvatar />
      </Header>
      <HomeDashBoard />
    </View>
  );
};

export default Index;
