import HomeAvatar from "@/components/avatar/HomeAvatar";
import HomeDashBoard from "@/components/board/HomeDashBoard";
import Header from "@/components/header/Header";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  return (
    <View>
      <Header>
        <Text>로고</Text>
        <HomeAvatar />
      </Header>
      <HomeDashBoard />
    </View>
  );
};

export default Index;
