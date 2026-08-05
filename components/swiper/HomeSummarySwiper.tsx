import RunSummaryBoard, {
  RUN_SUMMARY_CARD_HEIGHT,
} from "@/components/board/HomeDashBoard/RunSummaryBoard";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { Pet, usePetStore } from "@/store/usePetStore";
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

type WalkSummaryStats = {
  time: string;
  distance: string;
  pace: string;
};

type PetWalkSummary = {
  pet: Pet;
  stats: WalkSummaryStats;
};

/** TODO: API 연동 후 실제 산책 기록으로 교체 */
const FALLBACK_WALK_SUMMARIES: WalkSummaryStats[] = [
  { time: "00:32:10", distance: "2.4 km", pace: "13'25\"" },
  { time: "00:28:45", distance: "2.1 km", pace: "13'40\"" },
  { time: "00:35:02", distance: "2.8 km", pace: "12'30\"" },
];

const buildPetWalkSummaries = (pets: Pet[]): PetWalkSummary[] =>
  pets.map((pet, index) => ({
    pet,
    stats: FALLBACK_WALK_SUMMARIES[index % FALLBACK_WALK_SUMMARIES.length],
  }));

const EmptyWalkCard = () => {
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
          반려견을 등록하고 첫 산책을 시작해보세요
        </Text>
      </View>

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
    </View>
  );
};

const HomeSummarySwiper = () => {
  const petList = usePetStore((state) => state.petList);
  const summaries = React.useMemo(
    () => buildPetWalkSummaries(petList ?? []),
    [petList],
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
          <EmptyWalkCard />
        </View>
      )}
    </View>
  );
};

export default HomeSummarySwiper;
