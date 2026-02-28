import React from "react";
import { Text, View } from "react-native";

interface TipBoardProps {
  isMapLoaded: boolean;
}
const TipBoard = ({ isMapLoaded }: TipBoardProps) => {
  if (!isMapLoaded) return null;

  return (
    <View className="bottom-safe-offset-20 absolute left-1/2 w-80 -translate-x-1/2 items-center rounded-lg bg-primary-400 p-4">
      <Text>! 오늘의 팁</Text>
    </View>
  );
};

export default TipBoard;
