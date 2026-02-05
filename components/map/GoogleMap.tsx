import { useLocationPermission } from "@/hooks/use-location-permission";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Spinner } from "../ui/spinner";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const GoogleMap = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const permission = useLocationPermission();
  const mapRef = React.useRef<MapView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isLocationInitialized = React.useRef(false);
  useEffect(() => {
    const initLocation = async () => {
      if (permission === null || isLocationInitialized.current) return;
      try {
        if (permission !== true) {
          if (permission === false) setErrorMsg("위치 권한이 거부되었습니다.");
          return;
        }

        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          setErrorMsg("기기 위치 서비스가 꺼져 있습니다. 설정에서 켜 주세요.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        isLocationInitialized.current = true;
      } catch (error) {
        isLocationInitialized.current = true;
        console.error("위치 조회 실패:", error);
        setErrorMsg(
          "현재 위치를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Permission status:", permission);
    if (permission === true && !isLocationInitialized.current) initLocation();
  }, [permission]);

  useEffect(() => {
    if (!mapRef.current || !isLocationInitialized.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: DEFAULT_REGION.latitudeDelta,
        longitudeDelta: DEFAULT_REGION.longitudeDelta,
      },
      500,
    );
  }, [coordinates]);

  if (isLoading === true) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="large" color="#BFB8AA" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-base text-gray-700">{errorMsg}</Text>
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
          latitudeDelta: DEFAULT_REGION.latitudeDelta,
          longitudeDelta: DEFAULT_REGION.longitudeDelta,
        }}
        provider={PROVIDER_GOOGLE}
        showsCompass
        showsScale
        mapType="standard"
        showsUserLocation
        followsUserLocation
        zoomEnabled
      />
    </View>
  );
};

export default GoogleMap;
