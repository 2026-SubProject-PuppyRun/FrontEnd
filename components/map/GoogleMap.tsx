import { GOOGLE_MAP_DARK_STYLE } from "@/constants/googleMapDarkStyle";
import { GOOGLE_MAP_SILVER_STYLE } from "@/constants/googleMapSilverStyle";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

interface GoogleMapProps {
  onMapLoad: () => void;
  children?: React.ReactNode;
  isSummary?: boolean;
  style?: "dark" | "silver";
  /** 지도 위치 버튼 하단 여백 (px). 러닝 화면 액션 바 위에 올릴 때 사용 */
  locationButtonBottom?: number;
}

const GoogleMap = ({
  onMapLoad,
  children,
  isSummary,
  style,
}: GoogleMapProps) => {
  const [coordinates, setCoordinates] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const permission = useLocationPermission();
  const mapRef = React.useRef<MapView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isLocationInitialized = React.useRef(false);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const { isRunning } = useRunStore();
  const finalRoute = useRunStore((state) => state.runData?.route);
  const moveToMyLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("위치 이동 실패:", error);
    }
  };
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

  useEffect(() => {
    if (selectedRoute && selectedRoute.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(selectedRoute, {
          edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 500);
    } else if (
      selectedRoute === null &&
      mapRef.current &&
      isLocationInitialized.current
    ) {
      mapRef.current.animateToRegion(
        {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: DEFAULT_REGION.latitudeDelta,
          longitudeDelta: DEFAULT_REGION.longitudeDelta,
        },
        500,
      );
    }

    if (selectedRoute === undefined) {
      console.log("⚠️ selectedRoute가 undefined 입니다. 초기화 대기 중");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute]);

  useEffect(() => {
    const watchedRoute = finalRoute || [];
    if (isSummary && watchedRoute.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(watchedRoute, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [isSummary, finalRoute]);

  if (isLoading === true) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="large" color="#F25857" />
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
        onMapReady={onMapLoad}
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: DEFAULT_REGION.latitudeDelta,
          longitudeDelta: DEFAULT_REGION.longitudeDelta,
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={
          style === "dark" ? GOOGLE_MAP_DARK_STYLE : GOOGLE_MAP_SILVER_STYLE
        }
        showsCompass
        showsScale
        mapType="standard"
        showsUserLocation={!isSummary}
        zoomEnabled={!isSummary}
        scrollEnabled={!isSummary}
        pitchEnabled={!isSummary}
        rotateEnabled={!isSummary}
        showsMyLocationButton={false}
        onUserLocationChange={(e) => {
          if (isRunning && mapRef.current) {
            const { coordinate } = e.nativeEvent;
            if (coordinate) {
              mapRef.current.animateToRegion(
                {
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                  latitudeDelta: DEFAULT_REGION.latitudeDelta,
                  longitudeDelta: DEFAULT_REGION.longitudeDelta,
                },
                500,
              );
            }
          }
        }}
      >
        {children}
      </MapView>
      {!isSummary && (
        <TouchableOpacity
          onPress={moveToMyLocation}
          className="bottom-safe-offset-20 absolute right-3 rounded-full bg-white p-2.5 shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={24} color="#7D1D1C" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleMap;
