import { useRunStore } from "@/store/useRunStore";
import { formatTime } from "@/util/formatTime";
import React from "react";
import { Text, View } from "react-native";
import { HStack } from "../../ui/hstack";

const RunResultBoard = () => {
  const { runData } = useRunStore();
  return (
    <View className="my-16 h-32 w-full items-center justify-center bg-slate-400">
      <HStack space="xl">
        <Text>{runData?.pace}</Text>
        <Text>{((runData?.distance ?? 0) / 1000).toFixed(2)}km</Text>
        <Text>{formatTime(runData?.totalTime ?? 0)}</Text>
      </HStack>
    </View>
  );
};

export default RunResultBoard;
