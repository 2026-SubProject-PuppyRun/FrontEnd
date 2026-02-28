import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import RouteItem from "./RouteItem";
import SelfieItem from "./SelfieItem";

const swiperData = ["route", "selfie"];

const SelfieAndRouteSwiper = () => {
  const progress = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
  } as const;

  const ref = React.useRef<ICarouselInstance>(null);
  const width = Dimensions.get("window").width;

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
    <View id="carousel-component" style={{ gap: 10, marginTop: 30 }}>
      <View style={{ marginBottom: 10 }}>
        <Carousel
          ref={ref}
          {...baseOptions}
          loop
          onProgressChange={(offsetProgress, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          width={width}
          style={{ width: width, height: width * 0.7 }}
          data={swiperData}
          renderItem={({ index }) => {
            return index === 0 ? <RouteItem /> : <SelfieItem />;
          }}
        />
      </View>

      <Pagination.Basic
        progress={progress}
        data={swiperData}
        size={10}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "#262626",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "#f1f1f1",
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

export default SelfieAndRouteSwiper;
