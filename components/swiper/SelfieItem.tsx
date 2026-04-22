import { useRunStore } from "@/store/useRunStore";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

interface SelfieItemProps {
  selfieImgUrl?: string;
}
const SelfieItem = ({ selfieImgUrl }: SelfieItemProps) => {
  const runSelfieUri = useRunStore((state) => state.runData?.selfie);

  if (selfieImgUrl) {
    return (
      <View className="flex-1 items-center justify-center">
        <Image
          source={{ uri: selfieImgUrl }}
          style={{ height: "100%", aspectRatio: 4 / 5 }}
          contentFit="contain"
        />
      </View>
    );
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={{ uri: runSelfieUri || "" }}
        style={{ height: "100%", aspectRatio: 4 / 5 }}
        contentFit="contain"
      />
    </View>
  );
};

export default SelfieItem;
