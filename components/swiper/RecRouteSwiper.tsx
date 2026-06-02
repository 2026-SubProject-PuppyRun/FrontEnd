import MyRouteCard from "@/components/swiper/MyRouteCard";
import RecRouteSwiperSlide from "@/components/swiper/RecRouteSwiperSlide";
import RouteGuidanceToggle from "@/components/swiper/RouteGuidanceToggle";
import {
  getRouteParallaxOffset,
  ROUTE_SLIDE_SIZE,
  ROUTE_SWIPER_INACTIVE,
} from "@/constants/redButtonEffect";
import { useRunStore } from "@/store/useRunStore";
import * as React from "react";
import { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DummyRoute {
  latitude: number;
  longitude: number;
}

const dummyRoutes: DummyRoute[][] = [
  [
    { latitude: 37.16024976004391, longitude: 127.05596863884455 },
    { latitude: 37.15989961393599, longitude: 127.05762014831095 },
    { latitude: 37.15917190738391, longitude: 127.05919131757969 },
    { latitude: 37.1584342485709, longitude: 127.0610183222525 },
    { latitude: 37.158341473416584, longitude: 127.06252489379744 },
    { latitude: 37.15722905023573, longitude: 127.06248432612614 },
    { latitude: 37.1572691487399, longitude: 127.06030205274038 },
    { latitude: 37.156928161853386, longitude: 127.06027347933548 },
    { latitude: 37.157153355344136, longitude: 127.05888067131497 },
    { latitude: 37.15755271295674, longitude: 127.0578815377782 },
    { latitude: 37.15806888054634, longitude: 127.05669804585852 },
    { latitude: 37.15821334977841, longitude: 127.05521554987001 },
    { latitude: 37.1582298669273, longitude: 127.0542942425584 },
    { latitude: 37.16012184770064, longitude: 127.05427246142739 },
    { latitude: 37.16027650234487, longitude: 127.05588993045222 },
  ],
  [
    { latitude: 37.16020537868832, longitude: 127.05257491725177 },
    { latitude: 37.16013790888155, longitude: 127.05076797487942 },
    { latitude: 37.16135426990273, longitude: 127.05079619621239 },
    { latitude: 37.16134225219905, longitude: 127.05013508963128 },
    { latitude: 37.16224546162691, longitude: 127.05032134486629 },
    { latitude: 37.1626315254468, longitude: 127.05038360557387 },
    { latitude: 37.16262794739028, longitude: 127.05196630657923 },
    { latitude: 37.16349386786129, longitude: 127.05191352039554 },
    { latitude: 37.16349846350907, longitude: 127.05075632547374 },
    { latitude: 37.16401090953079, longitude: 127.05074714887758 },
    { latitude: 37.163881599358916, longitude: 127.05415693094562 },
    { latitude: 37.160199191882995, longitude: 127.05417682509659 },
    { latitude: 37.16016644321658, longitude: 127.05265043875528 },
  ],
  [
    { latitude: 37.15410733528742, longitude: 127.06684226327644 },
    { latitude: 37.152810995193235, longitude: 127.0656009362994 },
    { latitude: 37.15215701515831, longitude: 127.064860402509 },
    { latitude: 37.15291211699598, longitude: 127.06384962886824 },
    { latitude: 37.15426086769804, longitude: 127.06544234662306 },
    { latitude: 37.15512174175777, longitude: 127.06692230675924 },
    { latitude: 37.15537096223805, longitude: 127.06762149037746 },
    { latitude: 37.15597325338767, longitude: 127.06793468693763 },
    { latitude: 37.156233456307504, longitude: 127.06846459632618 },
    { latitude: 37.15676370864206, longitude: 127.06871154756391 },
    { latitude: 37.15727983857674, longitude: 127.0697460126122 },
    { latitude: 37.156454364235245, longitude: 127.0704970409875 },
    { latitude: 37.155386222004324, longitude: 127.068849269064 },
    { latitude: 37.15508846854058, longitude: 127.06817625998917 },
    { latitude: 37.15432299118714, longitude: 127.0673447979749 },
    { latitude: 37.15408777718554, longitude: 127.06676028719721 },
  ],
];

const ROUTE_META = [
  { distanceKm: "3.00km" },
  { distanceKm: "2.40km" },
  { distanceKm: "3.20km" },
];

interface RecRouteSwiperProps {
  disabled: boolean;
}

function RecRouteSwiper({ disabled }: RecRouteSwiperProps) {
  const screenWidth = Dimensions.get("window").width;
  const parallaxOffset = getRouteParallaxOffset(screenWidth);
  const ref = React.useRef<ICarouselInstance>(null);
  const lastRouteIndexRef = useRef(0);
  const setSelectedRoute = useRunStore((state) => state.setSelectedRoute);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const setRecommendedRoutes = useRunStore(
    (state) => state.setRecommendedRoutes,
  );
  const recommendedRoutes = useRunStore((state) => state.recommendedRoutes);
  const insets = useSafeAreaInsets();

  const routeEnabled = selectedRoute !== null;

  useEffect(() => {
    void setRecommendedRoutes(dummyRoutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      recommendedRoutes &&
      recommendedRoutes.length > 0 &&
      disabled === false
    ) {
      setSelectedRoute(recommendedRoutes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  if (disabled || recommendedRoutes === null) {
    return null;
  }

  return (
    <View
      className="absolute top-3 z-10 w-full items-center py-2"
      style={{ overflow: "visible", paddingTop: insets.top }}
      pointerEvents="box-none"
    >
      <View className="absolute right-3 top-1 z-20" style={{ top: insets.top }}>
        <RouteGuidanceToggle lastRouteIndex={lastRouteIndexRef.current} />
      </View>

      {routeEnabled ? (
        <View pointerEvents="box-none">
          <Carousel
            ref={ref}
            loop
            width={screenWidth}
            height={ROUTE_SLIDE_SIZE.height}
            style={{ overflow: "visible" }}
            containerStyle={{ overflow: "visible" }}
            pagingEnabled
            snapEnabled
            data={recommendedRoutes}
            scrollAnimationDuration={450}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxAdjacentItemScale: ROUTE_SWIPER_INACTIVE.scale,
              parallaxScrollingOffset: parallaxOffset,
            }}
            onSnapToItem={(index) => {
              const routeIndex = index % recommendedRoutes.length;
              lastRouteIndexRef.current = routeIndex;
              setSelectedRoute(recommendedRoutes[routeIndex]);
            }}
            renderItem={({ index, animationValue }) => {
              const routeIndex = index % recommendedRoutes.length;
              return (
                <View
                  className="items-center justify-center"
                  style={{
                    width: screenWidth,
                    height: ROUTE_SLIDE_SIZE.height,
                    overflow: "visible",
                  }}
                >
                  <RecRouteSwiperSlide
                    animationValue={animationValue}
                    routeNumber={routeIndex + 1}
                    distanceKm={ROUTE_META[routeIndex]?.distanceKm ?? "3.00km"}
                  />
                </View>
              );
            }}
          />
        </View>
      ) : (
        <MyRouteCard />
      )}
    </View>
  );
}

export default RecRouteSwiper;
