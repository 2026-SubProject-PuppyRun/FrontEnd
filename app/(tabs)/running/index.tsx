import RunStartButton from "@/components/button/RunStartButton";
import Header from "@/components/header/Header";
import GoogleMap from "@/components/map/GoogleMap";
import RecRouteSwiper from "@/components/swiper/RecRouteSwiper";
import React, { useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SelectedRoute {
  latitude: number;
  longitude: number;
}
const Index = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<SelectedRoute[] | null>(
    null,
  );

  return (
    <View className="flex-1 bg-white " style={{ paddingTop: insets.top }}>
      <Header />
      <View className="relative flex-1">
        <RecRouteSwiper
          disabled={!isMapLoaded}
          setSelectedRoute={(route: SelectedRoute[] | null) =>
            setSelectedRoute(route)
          }
          selectedRoute={selectedRoute}
        />
        <GoogleMap
          onMapLoad={() => setIsMapLoaded(true)}
          selectedRoute={selectedRoute}
        >
          {selectedRoute && (
            <Polyline
              coordinates={selectedRoute}
              strokeWidth={4}
              strokeColor="#FF0000"
            />
          )}
        </GoogleMap>
        <RunStartButton
          disabled={!isMapLoaded}
          selectedRoute={(route: SelectedRoute[] | null) =>
            setSelectedRoute(route)
          }
        />
      </View>
    </View>
  );
};

export default Index;
