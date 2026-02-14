import RunStartButton from "@/components/button/RunStartButton";
import Header from "@/components/header/Header";
import GoogleMap from "@/components/map/GoogleMap";
import RecRouteSwiper from "@/components/swiper/RecRouteSwiper";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = () => {
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white " style={{ paddingTop: insets.top }}>
      <Header />
      <View className="relative flex-1">
        <RecRouteSwiper disabled={!isMapLoaded} />
        <GoogleMap onMapLoad={() => setIsMapLoaded(true)} />
        <RunStartButton disabled={!isMapLoaded} />
      </View>
    </View>
  );
};

export default Index;
