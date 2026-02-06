import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

function RecRouteSwiper({ disabled }: { disabled: boolean }) {
  const progress = useSharedValue<number>(0);
  const width = Dimensions.get("window").width;

  if (disabled) {
    return null;
  }

  return (
    <View
      id="carousel-component"
      className="absolute top-28 z-10 h-32 w-full items-center justify-center"
    >
      <Carousel
        loop={true}
        width={width}
        height={(2 * width) / 5}
        pagingEnabled={true}
        snapEnabled={true}
        data={[...new Array(6).keys()]}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.8,
          parallaxScrollingOffset: 95,
        }}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => (
          <View className="flex-1 justify-center rounded-2xl border">
            <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default RecRouteSwiper;
