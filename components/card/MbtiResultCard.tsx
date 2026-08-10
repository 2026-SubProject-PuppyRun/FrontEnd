import {
  AlertCircleIcon,
  CheckCircleIcon,
  Icon,
  ShareIcon,
} from "@/components/ui/icon";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { mbtiResultData } from "@/constants/mbtiResultData";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { ApiError, useUpdatePetMbtiMutation } from "@/util/api";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

interface MbtiResultCardProps {
  resultMbti: string;
  petId: string;
  petName: string;
  isSaved?: boolean;
  onRetake?: () => void;
}

const mbtiImages: Record<string, number> = {
  ESTJ: require("@/assets/images/mbti/ESTJ.webp"),
  ESTP: require("@/assets/images/mbti/ESTP.webp"),
  ESFJ: require("@/assets/images/mbti/ESFJ.webp"),
  ESFP: require("@/assets/images/mbti/ESFP.webp"),
  ENTP: require("@/assets/images/mbti/ENTP.webp"),
  ENFJ: require("@/assets/images/mbti/ENFJ.webp"),
  ENFP: require("@/assets/images/mbti/ENFP.webp"),
  ISTJ: require("@/assets/images/mbti/ISTJ.webp"),
  ISTP: require("@/assets/images/mbti/ISTP.webp"),
  ISFJ: require("@/assets/images/mbti/ISFJ.webp"),
  ISFP: require("@/assets/images/mbti/ISFP.webp"),
  INTJ: require("@/assets/images/mbti/INTJ.webp"),
  INTP: require("@/assets/images/mbti/INTP.webp"),
  INFJ: require("@/assets/images/mbti/INFJ.webp"),
  INFP: require("@/assets/images/mbti/INFP.webp"),
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH * 0.62;

const MbtiResultCard = ({
  resultMbti,
  petId,
  petName,
  isSaved = false,
  onRetake,
}: MbtiResultCardProps) => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const { mutateAsync, isPending } = useUpdatePetMbtiMutation();
  const captureViewRef = useRef<View>(null);

  const mbtiImage = mbtiImages[resultMbti] || mbtiImages.ENFP;
  const resultInfo = mbtiResultData[resultMbti] ?? mbtiResultData.ENFP;

  const handleSave = async () => {
    if (!petId || isPending) return;

    try {
      await mutateAsync({ petId, mbti: resultMbti });
      showToast({
        message: `${petName}의 멍BTI가 저장되었어요!`,
        icon: CheckCircleIcon,
      });
      router.back();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message || "멍BTI 저장에 실패했어요."
          : "멍BTI 저장에 실패했어요. 잠시 후 다시 시도해 주세요.";
      showToast({
        message,
        icon: AlertCircleIcon,
      });
    }
  };

  const handleShare = async () => {
    const message = [
      `🐶 ${petName}의 멍BTI 결과`,
      `${resultInfo.mbti} — ${resultInfo.title}`,
      "",
      "PuppyRun에서 우리 아이 성격을 알아보세요!",
    ].join("\n");

    try {
      if (!captureViewRef.current) {
        throw new Error("캡처할 화면을 찾을 수 없어요.");
      }

      const uri = await captureRef(captureViewRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      if (Platform.OS === "ios") {
        await Share.share({
          title: `${petName}의 멍BTI`,
          message,
          url: uri,
        });
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: `${petName}의 멍BTI · ${resultInfo.mbti}`,
          UTI: "public.png",
        });
        return;
      }

      await Share.share({
        title: `${petName}의 멍BTI`,
        message,
      });
    } catch (error) {
      console.error("멍BTI 공유 실패:", error);
      showToast({
        message: "공유에 실패했어요. 다시 시도해주세요.",
        icon: AlertCircleIcon,
      });
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        ref={captureViewRef}
        collapsable={false}
        className="mb-6 rounded-3xl bg-[#F7F7F7] p-1"
      >
        <View className="mb-3 items-center rounded-3xl bg-white px-5 py-6 shadow-sm">
          <Text className="text-sm font-semibold text-gray-500">
            {petName}의 멍BTI 결과
          </Text>

          <View
            className="my-5 items-center justify-center overflow-hidden rounded-3xl bg-[#F7F7F7]"
            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          >
            <Image
              source={mbtiImage}
              contentFit="cover"
              transition={500}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View className="rounded-full bg-[#FFF8E1] px-5 py-2">
            <Text className="text-xl font-bold tracking-widest text-[#D97706]">
              {resultInfo.mbti}
            </Text>
          </View>

          <Text className="mt-4 text-center text-lg font-bold text-[#0D0F1B]">
            {resultInfo.title}
          </Text>

          <Text className="mt-3 text-center text-sm leading-6 text-gray-600">
            {resultInfo.description}
          </Text>

          <View className="mt-4 flex-row flex-wrap justify-center gap-2">
            {resultInfo.tags.map((tag) => (
              <View
                key={tag}
                className="rounded-full bg-[#F7F7F7] px-3 py-1.5"
              >
                <Text className="text-xs font-medium text-[#0D0F1B]">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
          <Text className="mb-3 text-sm font-semibold text-gray-500">
            궁합 정보
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-[#F0FDF4] px-3 py-3">
              <Text className="text-xs text-gray-500">잘 맞는 타입</Text>
              <Text className="mt-1 text-base font-bold text-[#16A34A]">
                {resultInfo.goodMatch}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-[#FFF0F0] px-3 py-3">
              <Text className="text-xs text-gray-500">안 맞는 타입</Text>
              <Text className="mt-1 text-base font-bold text-[#F25857]">
                {resultInfo.badMatch}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <RedButtonSurface
            borderRadius={30}
            backgroundColor="#F25857"
            shadowPadding={8}
            hostStyle={{ width: "100%" }}
            style={{ width: "100%", height: 56 }}
          >
            <Pressable
              onPress={isSaved ? onRetake : handleSave}
              disabled={!isSaved && isPending}
              className="h-full w-full items-center justify-center"
              style={({ pressed }) =>
                pressed || (!isSaved && isPending)
                  ? { opacity: 0.85 }
                  : undefined
              }
            >
              <Text className="text-base font-semibold text-white">
                {isSaved
                  ? "다시 검사하기"
                  : isPending
                    ? "저장 중..."
                    : "결과 저장하기"}
              </Text>
            </Pressable>
          </RedButtonSurface>
        </View>

        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="멍BTI 결과 공유"
          className="h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white active:opacity-70"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Icon as={ShareIcon} size="md" className="text-[#0D0F1B]" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default MbtiResultCard;
