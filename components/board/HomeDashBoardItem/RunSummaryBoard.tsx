import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Text, View } from "react-native";

const RunSummaryBoard = () => {
  return (
    <View className="m-4">
      <Text>오늘의 산책 요약</Text>
      <View className="my-4 flex-col gap-8 rounded-xl bg-white px-4 py-8 shadow">
        <View className="flex-row justify-around">
          <Avatar size="2xl">
            <AvatarImage
              className="object-cover"
              source={{ uri: "https://i.ifh.cc/jgbhah.jpg" }}
            />
          </Avatar>
          <View className="flex-col items-center justify-center">
            <Text>함께 달린 친구</Text>
            <Text>다케스탄</Text>
          </View>
        </View>
        <View className="flex-row justify-between px-6">
          <View>
            <Text className=" text-2xl font-bold">00:00:00</Text>
            <Text className="text-gray-600">산책 시간</Text>
          </View>
          <View>
            <Text className=" text-2xl font-bold">0.0 km</Text>
            <Text className="text-gray-600">산책 거리</Text>
          </View>
          <View>
            <Text className=" text-2xl font-bold">0&apos;00&quot;</Text>
            <Text className="text-gray-600">평균 페이스</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RunSummaryBoard;
