import RunStartButton from "@/components/button/RunStartButton";
import Header from "@/components/header/Header";
import GoogleMap from "@/components/map/GoogleMap";
import RecRouteSwiper from "@/components/swiper/RecRouteSwiper";
import { useRunStore } from "@/store/useRunStore";
import React, { useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const insets = useSafeAreaInsets();
  const selectedRoute = useRunStore((state) => state.selectedRoute);

  return (
    <View className="flex-1 bg-white " style={{ paddingTop: insets.top }}>
      <Header />
      <View className="relative flex-1">
        <RecRouteSwiper disabled={!isMapLoaded} />
        <GoogleMap onMapLoad={() => setIsMapLoaded(true)} style="silver">
          {selectedRoute && (
            <Polyline
              coordinates={selectedRoute}
              strokeWidth={4}
              strokeColor="#FF0000"
            />
          )}
        </GoogleMap>
        <RunStartButton disabled={!isMapLoaded} />
      </View>
    </View>
  );
};

export default Index;
