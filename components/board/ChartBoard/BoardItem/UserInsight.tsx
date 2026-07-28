import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

const DummyInsightComment = [
  "연속 5일 달리기 성공! 대단해요! 🏃‍♂️💨",
  "조금씩 꾸준히 하는 것이 가장 중요해요. 오늘도 파이팅! 💪",
  "상위 10%의 활동량을 기록하고 있어요! 👑",
  "오늘의 달리기 기록이 지난주보다 20% 향상되었어요! 📈",
];

const UserInsight = () => {
  const [commentIndex, setCommentIndex] = useState(0);
  const [insightComment, setInsightComment] = useState<string[] | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setInsightComment(DummyInsightComment);
  }, []);

  useEffect(() => {
    if (!insightComment?.length) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCommentIndex(
          (prevIndex) => (prevIndex + 1) % insightComment.length,
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim, insightComment]);

  const randomComment = insightComment
    ? insightComment[commentIndex]
    : "로딩 중...";

  return (
    <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="rounded-full bg-[#FFF0F0] p-2">
          <Ionicons name="sparkles" size={16} color="#F25857" />
        </View>
        <Text className="text-sm font-semibold text-gray-500">
          이번 주 인사이트
        </Text>
      </View>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text className="text-center text-base leading-6 text-[#0D0F1B]">
          {randomComment}
        </Text>
      </Animated.View>
    </View>
  );
};

export default UserInsight;
