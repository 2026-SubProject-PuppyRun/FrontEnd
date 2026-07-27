import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import RouteItem from "./RouteItem";
import SelfieItem from "./SelfieItem";

interface SelfieAndRouteSwiperProps {
  routeImgUrl?: string;
  selfieImgUrl?: string;
}

const swiperData = ["route", "selfie"];

const SelfieAndRouteSwiper = ({
  routeImgUrl,
  selfieImgUrl,
}: SelfieAndRouteSwiperProps) => {
  const progress = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
  } as const;

  const ref = React.useRef<ICarouselInstance>(null);
  const width = Dimensions.get("window").width;
  const cardWidth = Math.min(width - 48, 360);

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
    <View id="carousel-component">
      <View>
        <Carousel
          ref={ref}
          {...baseOptions}
          loop
          onProgressChange={(offsetProgress, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          width={width}
          style={{ width, height: width * 0.82 }}
          data={swiperData}
          renderItem={({ index }) => {
            return (
              <View
                style={{
                  width,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: cardWidth,
                    height: width * 0.68,
                    borderRadius: 28,
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    padding: 18,
                  }}
                >
                  {index === 1 ? (
                    <RouteItem routeImgUrl={routeImgUrl} />
                  ) : (
                    <SelfieItem selfieImgUrl={selfieImgUrl} />
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>

      <Pagination.Basic
        progress={progress}
        data={swiperData}
        size={10}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "#FFB3B2",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "#F25857",
        }}
        containerStyle={[
          {
            gap: 8,
            marginBottom: 16,
          },
        ]}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
};

export default SelfieAndRouteSwiper;
