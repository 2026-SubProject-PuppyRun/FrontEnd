import RunSummaryBoard from "../board/HomeDashBoard/RunSummaryBoard";
import { Text } from "@/components/ui/text";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const Dummy = [
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "다케스탄",
    time: "00:32:10",
    distance: "2.4 km",
    pace: "13'25\"",
  },
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "김동현",
    time: "00:28:45",
    distance: "2.1 km",
    pace: "13'40\"",
  },
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "추성훈",
    time: "00:35:02",
    distance: "2.8 km",
    pace: "12'30\"",
  },
];

const CARD_HEIGHT = 196;

const HomeSummarySwiper = () => {
  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const windowWidth = Dimensions.get("window").width;
  const PAGE_WIDTH = windowWidth - 48;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="mb-4 px-6">
      <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
        최근 산책 요약
      </Text>

      <Carousel
        ref={ref}
        width={PAGE_WIDTH}
        height={CARD_HEIGHT}
        loop
        onProgressChange={(_offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        data={Dummy}
        renderItem={({ item }) => (
          <View style={{ width: PAGE_WIDTH, height: CARD_HEIGHT }}>
            <RunSummaryBoard
              imgUrl={item.imgUrl}
              name={item.name}
              time={item.time}
              distance={item.distance}
              pace={item.pace}
            />
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={Dummy.map(() => ({ color: "#F25857" }))}
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
    </View>
  );
};

export default HomeSummarySwiper;
