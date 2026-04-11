import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import RunSummaryBoard from "../board/HomeDashBoardItem/RunSummaryBoard";
const Dummy = [
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "다케스탄",
    time: "00:00:00",
    distance: "0.0 km",
    pace: "0'00\"",
  },
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "김동현",
    time: "00:00:00",
    distance: "0.0 km",
    pace: "0'00\"",
  },
  {
    imgUrl: "https://i.ifh.cc/jgbhah.jpg",
    name: "추성훈",
    time: "00:00:00",
    distance: "0.0 km",
    pace: "0'00\"",
  },
];

const HomeSummarySwiper = () => {
  const progress = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
  } as const;

  const ref = React.useRef<ICarouselInstance>(null);

  const windowWidth = Dimensions.get("window").width;
  const PAGE_WIDTH = windowWidth - 30;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View id="carousel-component" className="m-4 gap-4 ">
      <Text>오늘의 산책 요약</Text>
      <View className="overflow-hidden">
        <Carousel
          ref={ref}
          {...baseOptions}
          width={PAGE_WIDTH}
          height={250}
          loop
          onProgressChange={(offsetProgress, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          data={Dummy}
          renderItem={({ item }) => (
            <RunSummaryBoard
              imgUrl={item.imgUrl}
              name={item.name}
              time={item.time}
              distance={item.distance}
              pace={item.pace}
            />
          )}
        />
      </View>

      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={Dummy.map((item) => ({ color: "#262626" }))}
        size={10}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "#BFB8AA",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "#737153",
        }}
        containerStyle={[
          {
            gap: 5,
            marginBottom: 10,
          },
        ]}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
};

export default HomeSummarySwiper;
