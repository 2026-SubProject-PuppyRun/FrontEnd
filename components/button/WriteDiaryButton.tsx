import { useRunStore } from "@/store/useRunStore";
import { useRouter } from "expo-router";
import React from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { View } from "../ui/view";
const WriteDiaryButton = () => {
  const router = useRouter();
  return (
    <View className="flex h-32 w-full items-center justify-center bg-primary-200">
      <Button
        className="mb-4"
        onPress={() => router.push("/(tabs)/running/diary")} // 이때 러닝 결과 서버 전송 한번 해야할듯
      >
        <Text className="text-white">일기 쓰러 가기</Text>
      </Button>
      <Button
        onPress={() => {
          router.replace("/");
          useRunStore.getState().resetRunData();
        }} // 이때 러닝 결과 서버 전송 한번 해야할듯, 스토어 초기화
      >
        <Text className="text-white">다음에 일기 쓰기</Text>
      </Button>
    </View>
  );
};

export default WriteDiaryButton;
