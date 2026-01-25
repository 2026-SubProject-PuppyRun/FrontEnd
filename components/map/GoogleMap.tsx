import { useLocationPermission } from "@/hooks/use-location-permission";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Spinner } from "../ui/spinner";

const GoogleMap = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const hasPermission = useLocationPermission();
  const mapRef = React.useRef<MapView>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLocation = async () => {
      try {
        if (await hasPermission) {
          const location = await Location.getCurrentPositionAsync({});
          setCoordinates({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error("위치 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initLocation();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>
          <Spinner className="h-10 w-10" />
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onRegionChangeComplete={(region) => {}}
        provider={PROVIDER_GOOGLE}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
        showsUserLocation={true}
        followsUserLocation={true}
      ></MapView>
    </View>
  );
};

export default GoogleMap;
