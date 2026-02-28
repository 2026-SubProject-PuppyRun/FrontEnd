import { useRunStore } from "@/store/useRunStore";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
const SelfieItem = () => {
  const selfieUri = useRunStore((state) => state.runData?.selfie);

  if (!selfieUri) {
    return (
      <View className="flex-1 items-center justify-center">
        {/* <Image
          source={require("../../assets/images/default_selfie.png")}
          style={{ height: "100%", aspectRatio: 4 / 5 }}
          contentFit="contain"
        /> */}
        <Text>피드 인증샷 자리</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={{ uri: selfieUri }}
        style={{ height: "100%", aspectRatio: 4 / 5 }}
        contentFit="contain"
      />
    </View>
  );
};

export default SelfieItem;
