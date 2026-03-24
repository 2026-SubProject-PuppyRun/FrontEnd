import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

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
    const fetchData = async () => {
      if (DummyInsightComment === null)
        setInsightComment(["정보가 부족하네요. 더 달려보세요!"]);
      setInsightComment(DummyInsightComment);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCommentIndex(
          (prevIndex) =>
            (prevIndex + 1) % (insightComment ? insightComment.length : 1),
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
    <View className="m-4 rounded-lg bg-white p-4 shadow">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text className="text-center">{randomComment}</Text>
      </Animated.View>
    </View>
  );
};

export default UserInsight;
