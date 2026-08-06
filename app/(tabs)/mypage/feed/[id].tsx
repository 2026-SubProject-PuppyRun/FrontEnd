import FeedDetailBody from "@/components/body/FeedDetailBody";
import Header, { HeaderIconButton } from "@/components/header/Header";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useTrackingDetailQuery } from "@/util/api";
import { resolveRouteParam } from "@/util/navigation/resolveRouteParam";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FeedDetailIndex = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveRouteParam(params.id);
  const insets = useSafeAreaInsets();

  const { data: feedDetail, isLoading, isError, refetch } =
    useTrackingDetailQuery(id);

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7F7]">
        <Spinner size="large" color="#F25857" />
      </View>
    );
  }

  if (isError || !feedDetail) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 items-center justify-center bg-[#F7F7F7] px-8"
      >
        <Text className="mb-4 text-center text-sm text-gray-500">
          피드를 불러오지 못했어요.
        </Text>
        <Pressable onPress={() => refetch()}>
          <Text className="text-sm font-semibold text-[#F25857]">
            다시 시도
          </Text>
        </Pressable>
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
          <HeaderIconButton onPress={handleShare} accessibilityLabel="공유하기">
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
