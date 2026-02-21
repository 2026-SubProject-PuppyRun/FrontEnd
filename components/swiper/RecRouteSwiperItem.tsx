import React from "react";
import { Text, View } from "react-native";

const RecRouteSwiperItem = ({ index }: { index: number }) => {
  return (
    <View className="flex-1 justify-center rounded-2xl bg-primary-400 shadow-md">
      <Text style={{ textAlign: "center", fontSize: 30 }}>
        {index + 1}번째 루트
      </Text>
    </View>
  );
};

export default RecRouteSwiperItem;
