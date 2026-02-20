import { useRunStore } from "@/store/useRunStore";
import * as React from "react";
import { useEffect } from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import RecRouteSwiperItem from "./RecRouteSwiperItem";

const defaultDataWith6Colors = ["#B0604D", "#899F9C", "#B3C680"];
interface DummyRoute {
  latitude: number;
  longitude: number;
}

// const dummyRoutes: DummyRoute[][] | null = null;

const dummyRoutes: DummyRoute[][] = [
  // Route 1
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
  // Route 2
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
  // Route 3
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
interface RecRouteSwiperProps {
  disabled: boolean;
}

function RecRouteSwiper({ disabled }: RecRouteSwiperProps) {
  const progress = useSharedValue<number>(0);
  const width = Dimensions.get("window").width;
  const ref = React.useRef<ICarouselInstance>(null);
  const setSelectedRoute = useRunStore((state) => state.setSelectedRoute);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const setRecommendedRoutes = useRunStore(
    (state) => state.setRecommendedRoutes,
  );
  const recommendedRoutes = useRunStore((state) => state.recommendedRoutes);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  useEffect(() => {
    const getRecommendedRoutes = async () => {
      await setRecommendedRoutes(dummyRoutes);
    };
    getRecommendedRoutes();
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

  if (disabled || recommendedRoutes === null || selectedRoute === null) {
    return null;
  }

  return (
    <View
      id="carousel-component"
      className="absolute top-12 z-10 h-32 w-full items-center justify-center"
    >
      <Carousel
        ref={ref}
        loop={true}
        width={width}
        height={(2 * width) / 5}
        pagingEnabled={true}
        snapEnabled={true}
        data={recommendedRoutes} // 더미 데이터 연결
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.8,
          parallaxScrollingOffset: 95,
        }}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        onSnapToItem={(index) => {
          const routeIndex = index % recommendedRoutes.length;
          setSelectedRoute(recommendedRoutes[routeIndex]);
        }}
        renderItem={({ index }) => <RecRouteSwiperItem index={index} />}
      />
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={defaultDataWith6Colors.map((color) => ({ color }))}
        dotStyle={{
          width: 25,
          height: 4,
          backgroundColor: "#BFB8AA",
        }}
        activeDotStyle={{
          overflow: "hidden",
          backgroundColor: "gray",
        }}
        containerStyle={{
          gap: 10,
          marginBottom: 10,
        }}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
}

export default RecRouteSwiper;
