import RunSummaryBoard, {
  RUN_SUMMARY_CARD_HEIGHT,
} from "@/components/board/HomeDashBoard/RunSummaryBoard";
import RunSummarySkeleton from "@/components/skeleton/RunSummarySkeleton";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import {
  mapPetLastTrackingsToSummaries,
  usePetLastTrackingQuery,
} from "@/util/api/activity-tracking";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Dimensions, Pressable, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const CARD_HEIGHT = RUN_SUMMARY_CARD_HEIGHT;

const EmptyWalkCard = ({ hasPets }: { hasPets: boolean }) => {
  const router = useRouter();

  return (
    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
      <View className="items-center py-3">
        <View className="mb-3 rounded-full bg-[#FFF0F0] p-4">
          <Ionicons name="paw-outline" size={28} color="#F25857" />
        </View>
        <Text className="text-center text-base font-semibold text-[#0D0F1B]">
          아직 산책 기록이 없어요
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-500">
          {hasPets
            ? "첫 산책을 다녀오면 여기에 요약이 표시돼요"
            : "반려견을 등록하고 첫 산책을 시작해보세요"}
        </Text>
      </View>

      {!hasPets ? (
        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 48 }}
        >
          <Pressable
            onPress={() => router.push("/mypage/pets/create")}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-sm font-semibold text-white">
              반려견 등록하기
            </Text>
          </Pressable>
        </RedButtonSurface>
      ) : null}
    </View>
  );
};

const HomeSummarySwiper = () => {
  const petList = usePetStore((state) => state.petList);
  const hasPets = (petList?.length ?? 0) > 0;
  const { data, isPending, isError, error, refetch } =
    usePetLastTrackingQuery(hasPets);

  React.useEffect(() => {
    if (isError) {
      console.log("[HomeSummarySwiper] petLastTracking error", error);
    }
    if (data) {
      console.log("[HomeSummarySwiper] petLastTracking data", data);
    }
  }, [data, error, isError]);

  const summaries = React.useMemo(
    () => mapPetLastTrackingsToSummaries(data?.activities ?? [], petList),
    [data?.activities, petList],
  );

  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const windowWidth = Dimensions.get("window").width;
  const PAGE_WIDTH = windowWidth - 48;
  const hasSummaries = summaries.length > 0;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  if (hasPets && isPending) {
    return (
      <View className="mb-4 px-6" style={{ height: CARD_HEIGHT }}>
        <RunSummarySkeleton />
      </View>
    );
  }

  if (hasPets && isError) {
    return (
      <View className="mb-4 px-6">
        <View
          className="items-center justify-center rounded-3xl bg-white px-5 py-8 shadow-sm"
          style={{ minHeight: CARD_HEIGHT }}
        >
          <Text
            className="text-center text-sm text-gray-500"
            onPress={() => refetch()}
          >
            산책 요약을 불러오지 못했어요.{"\n"}탭해서 다시 시도해 주세요.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4 px-6">
      {hasSummaries ? (
        <>
          <Carousel
            ref={ref}
            width={PAGE_WIDTH}
            height={CARD_HEIGHT}
            loop={summaries.length > 1}
            onProgressChange={(_offsetProgress, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            data={summaries}
            renderItem={({ item }) => (
              <View style={{ width: PAGE_WIDTH, height: CARD_HEIGHT }}>
                <RunSummaryBoard
                  pet={item.pet}
                  time={item.stats.time}
                  distance={item.stats.distance}
                  pace={item.stats.pace}
                />
              </View>
            )}
          />

          {summaries.length > 1 ? (
            <Pagination.Basic
              progress={progress}
              data={summaries.map(() => ({ color: "#F25857" }))}
              size={8}
              dotStyle={{
                borderRadius: 100,
                backgroundColor: "#FFB3B2",
              }}
              activeDotStyle={{
                borderRadius: 100,
                backgroundColor: "#F25857",
              }}
              containerStyle={{ gap: 6, marginTop: 10 }}
              horizontal
              onPress={onPressPagination}
            />
          ) : null}
        </>
      ) : (
        <View style={{ width: PAGE_WIDTH, height: CARD_HEIGHT }}>
          <EmptyWalkCard hasPets={hasPets} />
        </View>
      )}
    </View>
  );
};

export default HomeSummarySwiper;
