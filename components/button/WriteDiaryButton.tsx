import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRunStore } from "@/store/useRunStore";
import { ApiError } from "@/util/api";
import { submitWalkDiary } from "@/util/run/submitWalkDiary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import RedButtonSurface from "../ui/RedButtonSurface";
import { Text } from "../ui/text";
import { View } from "../ui/view";

const WriteDiaryButton = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkipDiary = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await submitWalkDiary("", "");
      useRunStore.getState().resetRunSession();
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "일기 등록에 실패했습니다. 다시 시도해 주세요.";
      showToast({ message });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            disabled={isSubmitting}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) =>
              pressed || isSubmitting ? { opacity: 0.85 } : undefined
            }
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
            onPress={handleSkipDiary}
            disabled={isSubmitting}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) =>
              pressed || isSubmitting ? { opacity: 0.85 } : undefined
            }
          >
            {isSubmitting ? (
              <ActivityIndicator color="#F25857" />
            ) : (
              <Text className="text-lg font-semibold text-primary-500">
                다음에 일기 쓰기
              </Text>
            )}
          </Pressable>
        </RedButtonSurface>
      </View>
    </View>
  );
};

export default WriteDiaryButton;
