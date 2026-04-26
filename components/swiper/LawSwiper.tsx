import { LawList } from "@/constants/lawData";
import React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import LawCard from "../card/LawCard";

const LawSwiper = () => {
  const progress = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
  } as const;

  const ref = React.useRef<ICarouselInstance>(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const PAGE_WIDTH = windowWidth - 30;
  const PAGE_HEIGHT = windowHeight * 0.7;

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
    <View id="carousel-component" className="m-4 gap-4">
      <Carousel
        ref={ref}
        vertical={true}
        autoPlayInterval={2000}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
        }}
        mode={"vertical-stack"}
        modeConfig={{
          stackInterval: 18,
        }}
        customConfig={() => ({ type: "positive", viewCount: 5 })}
        data={LawList}
        renderItem={({ item }) => <LawCard key={item.id} {...item} />}
      />
    </View>
  );
};

export default LawSwiper;
