import FeedDetailBody from "@/components/body/FeedDetailBody";
import Header, { HeaderIconButton } from "@/components/header/Header";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { FeedDetail } from "@/types/feed";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FeedDetailIndex = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [feedDetail, setFeedDetail] = useState<FeedDetail | null>(null);

  const dummyFeedDetail = useMemo<FeedDetail>(
    () => ({
      id: `${id}`,
      selfieImgUrl: "https://picsum.photos/1080/1350?random=1",
      routeImgUrl: "https://picsum.photos/1080/1350?random=2",
      pace: "10'00\"",
      distance: 5000,
      duration: 3000,
      date: new Date(),
      title: "멍멍이와 함께한 즐거운 러닝",
      contents:
        "오늘은 멍멍이와 함께 공원에서 러닝을 했어요! 날씨도 좋고, 멍멍이도 신나서 정말 즐거운 시간이었답니다. 앞으로도 자주 함께 달려야겠어요!",
    }),
    [id],
  );

  useEffect(() => {
    setFeedDetail(dummyFeedDetail);
  }, [dummyFeedDetail]);

  const runDateLabel = feedDetail
    ? `${feedDetail.date.getFullYear()}.${feedDetail.date.getMonth() + 1}.${feedDetail.date.getDate()} 산책`
    : "";

  const handleShare = async () => {
    if (!feedDetail) return;

    try {
      await Share.share({
        message: `${feedDetail.title ?? "산책 기록"}\n${feedDetail.contents ?? ""}`,
      });
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  if (!feedDetail) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7F7]">
        <Spinner size="large" color="#F25857" />
      </View>
    );
  }

  return (
    <View
      style={{ paddingBottom: insets.bottom + 40 }}
      className="flex-1 bg-[#F7F7F7]"
    >
      <Header
        center={
          <Text
            className="text-base font-semibold text-[#0D0F1B]"
            numberOfLines={1}
          >
            {runDateLabel}
          </Text>
        }
        right={
          <HeaderIconButton
            onPress={handleShare}
            accessibilityLabel="공유하기"
          >
            <Ionicons name="share-outline" size={22} color="#0D0F1B" />
          </HeaderIconButton>
        }
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FeedDetailBody {...feedDetail} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FeedDetailIndex;
