import RunStartButton from "@/components/button/RunStartButton";
import Header from "@/components/header/Header";
import GoogleMap from "@/components/map/GoogleMap";
import RecRouteSwiper from "@/components/swiper/RecRouteSwiper";
import React from "react";
import { View } from "react-native";

const Index = () => {
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);

  return (
    <>
      <Header />
      <View className="relative flex-1">
        <RecRouteSwiper disabled={!isMapLoaded} />
        <GoogleMap onMapLoad={() => setIsMapLoaded(true)} />
        <RunStartButton disabled={!isMapLoaded} />
      </View>
    </>
  );
};

export default Index;
