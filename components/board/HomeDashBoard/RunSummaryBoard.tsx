import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Text, View } from "react-native";

interface RunSummaryBoardProps {
  imgUrl: string;
  name: string;
  time: string;
  distance: string;
  pace: string;
}
const RunSummaryBoard: React.FC<RunSummaryBoardProps> = ({
  imgUrl,
  name,
  time,
  distance,
  pace,
}) => {
  return (
    <View className=" w-full flex-col gap-8 rounded-xl bg-white px-4 py-8 shadow">
      <View className="flex-row justify-around">
        <Avatar size="2xl">
          <AvatarImage className="object-cover" source={{ uri: imgUrl }} />
        </Avatar>
        <View className="flex-col items-center justify-center">
          <Text>함께 달린 친구</Text>
          <Text>{name}</Text>
        </View>
      </View>
      <View className="flex-row justify-between px-6">
        <View>
          <Text className=" text-2xl font-bold">{time}</Text>
          <Text className="text-gray-600">산책 시간</Text>
        </View>
        <View>
          <Text className=" text-2xl font-bold">{distance}</Text>
          <Text className="text-gray-600">산책 거리</Text>
        </View>
        <View>
          <Text className=" text-2xl font-bold">{pace}</Text>
          <Text className="text-gray-600">평균 페이스</Text>
        </View>
      </View>
    </View>
  );
};

export default RunSummaryBoard;
