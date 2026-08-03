import MbtiResultCard from "@/components/card/MbtiResultCard";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { mbtiQuestionData } from "@/constants/mbtiQuestionData";
import { getResultMbti } from "@/util/mbti";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface MbtiBodyProps {
  petId: string;
  petName: string;
  savedMbti?: string;
}

const MbtiBody = ({ petId, petName, savedMbti }: MbtiBodyProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRetaking, setIsRetaking] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const totalQuestions = mbtiQuestionData.length;
  const progressValue = Math.round((currentIndex / totalQuestions) * 100);
  const quizCompleted = currentIndex >= totalQuestions;
  const showSavedResult = Boolean(savedMbti) && !isRetaking && !quizCompleted;

  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    const currentQ = mbtiQuestionData[currentIndex];
    const pickedValue =
      direction === "LEFT" ? currentQ.answerA.value : currentQ.answerB.value;

    setAnswers((prev) => [...prev, pickedValue]);
    setCurrentIndex((prev) => prev + 1);

    translateX.value = 0;
    translateY.value = 0;
  };

  const handleRetake = () => {
    setIsRetaking(true);
    setCurrentIndex(0);
    setAnswers([]);
    translateX.value = 0;
    translateY.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipe)("RIGHT");
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipe)("LEFT");
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-8, 0, 8],
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  if (showSavedResult && savedMbti) {
    return (
      <MbtiResultCard
        resultMbti={savedMbti}
        petId={petId}
        petName={petName}
        isSaved
        onRetake={handleRetake}
      />
    );
  }

  if (quizCompleted) {
    const resultMbti = getResultMbti(answers);
    return (
      <MbtiResultCard
        resultMbti={resultMbti}
        petId={petId}
        petName={petName}
      />
    );
  }

  const currentQuestion = mbtiQuestionData[currentIndex];

  return (
    <View className="flex-1 px-6 pb-8">
      <View className="mb-5">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-[#0D0F1B]">
            {currentIndex + 1} / {totalQuestions}
          </Text>
          <Text className="text-sm text-gray-500">{progressValue}%</Text>
        </View>
        <Progress className="h-2 w-full" size="sm" value={progressValue}>
          <ProgressFilledTrack className="rounded-full bg-[#F25857]" />
        </Progress>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="min-h-[420px] rounded-3xl bg-white p-6 shadow-sm"
          style={cardStyle}
        >
          <View className="mb-2 items-center">
            <View className="rounded-full bg-[#FFF0F0] px-3 py-1">
              <Text className="text-xs font-semibold text-[#F25857]">
                Q{currentIndex + 1}
              </Text>
            </View>
          </View>

          <Text className="mb-8 text-center text-lg font-bold leading-7 text-[#0D0F1B]">
            {currentQuestion.question}
          </Text>

          <View className="gap-3">
            <Pressable
              onPress={() => handleSwipe("LEFT")}
              className="rounded-2xl border border-[#F25857]/25 bg-[#FFF0F0] px-4 py-4"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <View className="mb-2 flex-row items-center gap-1">
                <Ionicons name="arrow-back" size={14} color="#F25857" />
                <Text className="text-xs font-semibold text-[#F25857]">
                  왼쪽 선택
                </Text>
              </View>
              <Text className="text-center text-sm leading-5 text-[#0D0F1B]">
                {currentQuestion.answerA.text}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleSwipe("RIGHT")}
              className="rounded-2xl border border-outline-200 bg-[#F7F7F7] px-4 py-4"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <View className="mb-2 flex-row items-center justify-end gap-1">
                <Text className="text-xs font-semibold text-gray-500">
                  오른쪽 선택
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#6B7280" />
              </View>
              <Text className="text-center text-sm leading-5 text-[#0D0F1B]">
                {currentQuestion.answerB.text}
              </Text>
            </Pressable>
          </View>

          <Text className="mt-6 text-center text-xs text-gray-400">
            카드를 스와이프하거나 답변을 탭해주세요
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MbtiBody;
