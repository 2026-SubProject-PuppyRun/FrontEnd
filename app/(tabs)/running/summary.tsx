import RunResultBoard from "@/components/board/RunResultBoard";
import SelfieButton from "@/components/button/SelfieButton";
import GoogleMap from "@/components/map/GoogleMap";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunStore } from "@/store/useRunStore";
import { useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Summary = () => {
  const insets = useSafeAreaInsets();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const finalRoute = useRunStore((state) => state.runData?.route ?? []);
  useNonNavbar();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1">
      <View className="h-2/5 bg-white">
        <GoogleMap onMapLoad={() => setIsMapLoaded(true)} isSummary={true}>
          {isMapLoaded && finalRoute.length > 0 && (
            <Polyline
              coordinates={finalRoute.map((coord) => ({
                latitude: coord.latitude,
                longitude: coord.longitude,
              }))}
              strokeColor="#FF0000"
              strokeWidth={4}
            />
          )}
        </GoogleMap>
      </View>
      <RunResultBoard />
      <SelfieButton />
    </View>
  );
};

export default Summary;
