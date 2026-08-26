import MyRouteCard from "@/components/swiper/MyRouteCard";
import RecRouteSwiperSlide from "@/components/swiper/RecRouteSwiperSlide";
import RouteGuidanceToggle from "@/components/swiper/RouteGuidanceToggle";
import { RECOMMENDED_ROUTES_ENABLED } from "@/constants/featureFlags";
import {
  getRouteParallaxOffset,
  ROUTE_SLIDE_SIZE,
  ROUTE_SWIPER_INACTIVE,
} from "@/constants/redButtonEffect";
import { useRunStore } from "@/store/useRunStore";
import { useRecommendedRoutesQuery } from "@/util/api/tracking";
import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { Dimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RecRouteSwiperProps {
  disabled: boolean;
}

const formatDistanceKm = (meters: number) => `${(meters / 1000).toFixed(2)}km`;

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

  const { data: mappedRoutes, isSuccess } = useRecommendedRoutesQuery({
    enabled: RECOMMENDED_ROUTES_ENABLED && !disabled,
  });

  const routeDistances = useMemo(
    () =>
      (mappedRoutes ?? []).map((route) =>
        formatDistanceKm(route.distanceMeters),
      ),
    [mappedRoutes],
  );

  const routeEnabled = selectedRoute !== null;

  // 추천 루트 비활성화: API/선택 상태 초기화
  useEffect(() => {
    if (RECOMMENDED_ROUTES_ENABLED) return;
    setRecommendedRoutes([]);
    setSelectedRoute(null);
  }, [setRecommendedRoutes, setSelectedRoute]);

  useEffect(() => {
    if (!RECOMMENDED_ROUTES_ENABLED) return;
    if (!isSuccess || !mappedRoutes) return;

    const paths = mappedRoutes.map((route) => route.path);
    setRecommendedRoutes(paths.length > 0 ? paths : []);

    if (paths.length > 0 && !disabled) {
      setSelectedRoute(paths[0]);
      lastRouteIndexRef.current = 0;
    }
  }, [
    disabled,
    isSuccess,
    mappedRoutes,
    setRecommendedRoutes,
    setSelectedRoute,
  ]);

  if (!RECOMMENDED_ROUTES_ENABLED) {
    return null;
  }

  if (disabled || recommendedRoutes === null) {
    return null;
  }

  if (recommendedRoutes.length === 0) {
    return (
      <View
        className="absolute top-3 z-10 w-full items-center py-2"
        style={{ overflow: "visible", paddingTop: insets.top }}
        pointerEvents="box-none"
      >
        <MyRouteCard />
      </View>
    );
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
                    distanceKm={routeDistances[routeIndex] ?? "0.00km"}
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
