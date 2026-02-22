import RunDataBoard from "@/components/board/RunDataBoard";
import GoogleMap from "@/components/map/GoogleMap";
import { useRunTracking } from "@/hooks/use-run-tracking";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tracking = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const actualRoute = useRunStore((state) => state.actualRoute);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  useRunTracking();
  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="relative flex-1 bg-white"
    >
      <RunDataBoard isMapLoaded={isMapLoaded} />
      <GoogleMap onMapLoad={() => setIsMapLoaded(true)}>
        {selectedRoute && (
          <Polyline
            coordinates={selectedRoute}
            strokeWidth={4}
            strokeColor="#FF0000"
          />
        )}
        {actualRoute.length > 0 && (
          <Polyline
            coordinates={actualRoute}
            strokeWidth={4}
            strokeColor="#0000FF"
          />
        )}
      </GoogleMap>
    </View>
  );
};

export default Tracking;
