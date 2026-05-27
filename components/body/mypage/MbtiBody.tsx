import MbtiResultCard from "@/components/card/MbtiResultCard";
import { Text } from "@/components/ui/text";
import { mbtiQuestionData } from "@/constants/mbtiQuestionData";
import { getResultMbti } from "@/util/mbti";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 화면의 30%를 넘기면 스와이프 처리

const MbtiBody = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  // 현재 카드의 X, Y 이동 값
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // 스와이프 시 데이터 처리 (JS Thread에서 실행)
  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    const currentQ = mbtiQuestionData[currentIndex];
    const pickedValue =
      direction === "LEFT" ? currentQ.answerA.value : currentQ.answerB.value;

    setAnswers((prev) => [...prev, pickedValue]);
    setCurrentIndex((prev) => prev + 1);

    translateX.value = 0;
    translateY.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 드래그 중 이동 거리 반영
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      // 드래그가 끝났을 때 임계값 체크
      if (translateX.value > SWIPE_THRESHOLD) {
        // 오른쪽 스와이프 완료
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipe)("RIGHT");
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // 왼쪽 스와이프 완료
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipe)("LEFT");
        });
      } else {
        // 제자리로 복귀
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // 애니메이션 스타일
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: currentIndex >= mbtiQuestionData.length ? 0.8 : 1 },
        { perspective: 1500 },
      ],
      opacity: withSpring(currentIndex >= mbtiQuestionData.length ? 0 : 1),
    };
  });

  // 모든 검사가 끝났을 경우
  if (currentIndex >= mbtiQuestionData.length) {
    const resultMbti = getResultMbti(answers);
    return <MbtiResultCard resultMbti={resultMbti} />;
  }

  const currentQuestion = mbtiQuestionData[currentIndex];

  return (
    <View className="relative flex-1 items-center justify-center bg-gray-50 p-4">
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="absolute h-[60%] w-full items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
          style={cardStyle}
        >
          <View className="mb-8 items-center">
            <Text className="mb-2 font-bold text-gray-400">
              {currentIndex + 1} / {mbtiQuestionData.length}
            </Text>
            <Text size="2xl" className="text-center font-bold text-black">
              {currentQuestion.question}
            </Text>
          </View>

          <View className="flex w-full flex-col gap-4 space-y-4">
            <View className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <Text className="text-center text-blue-700">
                👈 왼쪽으로 밀기 {"\n"} {currentQuestion.answerA.text}
              </Text>
            </View>
            <View className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <Text className="text-center text-orange-700">
                오른쪽으로 밀기 👉 {"\n"} {currentQuestion.answerB.text}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MbtiBody;
