import RunStartButton from "@/components/button/RunStartButton";
import GoogleMap from "@/components/map/GoogleMap";
import RecRouteSwiper from "@/components/swiper/RecRouteSwiper";
import { useRunStore } from "@/store/useRunStore";
import React, { useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";

const Index = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const selectedRoute = useRunStore((state) => state.selectedRoute);

  return (
    <View className="flex-1 bg-transparent ">
      <View className="relative flex-1">
        <GoogleMap onMapLoad={() => setIsMapLoaded(true)} style="silver">
          {selectedRoute && (
            <Polyline
              coordinates={selectedRoute}
              strokeWidth={3}
              strokeColor="#F25857"
            />
          )}
        </GoogleMap>
        <RecRouteSwiper disabled={!isMapLoaded} />
        <RunStartButton disabled={!isMapLoaded} />
      </View>
    </View>
  );
};

export default Index;
