import PetBody from "@/components/body/mypage/PetBody";
import Header from "@/components/header/Header";
import React from "react";
import { View } from "react-native";

const Index = () => {
  return (
    <View>
      <Header title="반려견 목록" />
      <PetBody />
    </View>
  );
};

export default Index;
