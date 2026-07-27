import { useRunStore } from "@/store/useRunStore";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import RedButtonSurface from "../ui/RedButtonSurface";
import { Text } from "../ui/text";
import { View } from "../ui/view";

const WriteDiaryButton = () => {
  const router = useRouter();

  return (
    <View className="w-full px-6 pb-8">
      <View className="gap-2">
        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 64 }}
        >
          <Pressable
            onPress={() => router.push("/(tabs)/running/diary")}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-lg font-semibold text-white">
              일기 쓰러 가기
            </Text>
          </Pressable>
        </RedButtonSurface>

        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#FFFFFF"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 64 }}
        >
          <Pressable
            onPress={() => {
              router.replace("/");
              useRunStore.getState().resetRunData();
            }}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-lg font-semibold text-primary-500">
              다음에 일기 쓰기
            </Text>
          </Pressable>
        </RedButtonSurface>
      </View>
    </View>
  );
};

export default WriteDiaryButton;
