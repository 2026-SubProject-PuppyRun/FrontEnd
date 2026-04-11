import AlarmBody from "@/components/body/AlarmBody";
import Header from "@/components/header/Header";
import React from "react";
import { View } from "react-native";

const Alarm = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <Header title="알림" />
      <AlarmBody />
    </View>
  );
};

export default Alarm;
