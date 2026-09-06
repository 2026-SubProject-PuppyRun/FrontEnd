import RecRouteSwiperItem from "@/components/swiper/RecRouteSwiperItem";
import ConvexShadowSurface from "@/components/ui/ConvexShadowSurface";
import {
  RED_BUTTON_EFFECT,
  ROUTE_CARD_SHADOW_PAD,
  ROUTE_CARD_SIZE,
  ROUTE_SWIPER_INACTIVE,
} from "@/constants/redButtonEffect";
import { StyleSheet, View } from "react-native";
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface RecRouteSwiperSlideProps {
  animationValue: SharedValue<number>;
  routeNumber: number;
  distanceKm: string;
}

const RecRouteSwiperSlide = ({
  animationValue,
  routeNumber,
  distanceKm,
}: RecRouteSwiperSlideProps) => {
  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      [
        ROUTE_SWIPER_INACTIVE.fill,
        RED_BUTTON_EFFECT.fill,
        ROUTE_SWIPER_INACTIVE.fill,
      ],
    ),
  }));

  const bevelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.slot}>
      <ConvexShadowSurface
        shadowPadding={ROUTE_CARD_SHADOW_PAD}
        style={ROUTE_CARD_SIZE}
        fillStyle={fillStyle}
        bevelStyle={bevelStyle}
      >
        <RecRouteSwiperItem
          routeNumber={routeNumber}
          distanceKm={distanceKm}
        />
      </ConvexShadowSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    marginTop: 30,
  },
});

export default RecRouteSwiperSlide;
