import RunLocationMarker from "@/components/map/RunLocationMarker";
import { GOOGLE_MAP_DARK_STYLE } from "@/constants/googleMapDarkStyle";
import { GOOGLE_MAP_SILVER_STYLE } from "@/constants/googleMapSilverStyle";
import { MAP_LOCATION_WATCH } from "@/constants/locationTracking";
import { useCompassHeading } from "@/hooks/use-compass-heading";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useRunStore } from "@/store/useRunStore";
import { getCurrentPositionWithRetry } from "@/util/location";
import { recordRunLocation } from "@/util/run/recordRunLocation";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const DEFAULT_SUMMARY_PADDING = {
  top: 48,
  right: 48,
  bottom: 48,
  left: 48,
};

const getRouteCenter = (
  route: { latitude: number; longitude: number }[],
) => {
  const mid = route[Math.floor(route.length / 2)] ?? route[0];
  return {
    latitude: mid.latitude,
    longitude: mid.longitude,
  };
};

interface GoogleMapProps {
  onMapLoad: () => void;
  children?: React.ReactNode;
  isSummary?: boolean;
  style?: "dark" | "silver";
  fitEdgePadding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const GoogleMap = ({
  onMapLoad,
  children,
  isSummary,
  style,
  fitEdgePadding,
}: GoogleMapProps) => {
  const permission = useLocationPermission();
  const mapRef = React.useRef<MapView>(null);
  const isMapReady = React.useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isLocationInitialized = React.useRef(false);
  const locationSubscription =
    React.useRef<Location.LocationSubscription | null>(null);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const finalRoute = useRunStore((state) => state.runData?.route);
  const heading = useCompassHeading(permission === true && !isSummary);

  const summaryRoute = useMemo(
    () => (isSummary ? finalRoute ?? [] : []),
    [isSummary, finalRoute],
  );

  const [coordinates, setCoordinates] = useState(() =>
    summaryRoute.length > 0
      ? getRouteCenter(summaryRoute)
      : {
          latitude: DEFAULT_REGION.latitude,
          longitude: DEFAULT_REGION.longitude,
        },
  );

  const edgePadding = fitEdgePadding ?? DEFAULT_SUMMARY_PADDING;

  const fitSummaryRoute = useCallback(() => {
    if (!isSummary || !mapRef.current || summaryRoute.length === 0) return;

    mapRef.current.fitToCoordinates(summaryRoute, {
      edgePadding,
      animated: false,
    });
  }, [isSummary, summaryRoute, edgePadding]);

  const handleMapReady = () => {
    isMapReady.current = true;
    fitSummaryRoute();
    onMapLoad();
  };

  const moveToMyLocation = async () => {
    try {
      const location = await getCurrentPositionWithRetry({
        initialDelayMs: 0,
        maxAttempts: 2,
      });
      const next = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoordinates(next);
      mapRef.current?.animateToRegion(
        {
          ...next,
          latitudeDelta: DEFAULT_REGION.latitudeDelta,
          longitudeDelta: DEFAULT_REGION.longitudeDelta,
        },
        500,
      );
    } catch (error) {
      console.error("위치 이동 실패:", error);
    }
  };

  // 요약 화면: GPS 없이 루트 기준으로 바로 표시
  useEffect(() => {
    if (!isSummary) return;

    if (summaryRoute.length === 0) {
      setErrorMsg("표시할 산책 경로가 없습니다.");
      setIsLoading(false);
      return;
    }

    setCoordinates(getRouteCenter(summaryRoute));
    setErrorMsg(null);
    setIsLoading(false);
  }, [isSummary, summaryRoute]);

  // 일반 맵: 현재 위치 초기화
  useEffect(() => {
    if (isSummary) return;
    if (permission === null || isLocationInitialized.current) return;

    if (permission === false) {
      setErrorMsg("위치 권한이 거부되었습니다.");
      setIsLoading(false);
      return;
    }

    const initLocation = async () => {
      try {
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          setErrorMsg("기기 위치 서비스가 꺼져 있습니다. 설정에서 켜 주세요.");
          return;
        }

        const location = await getCurrentPositionWithRetry();
        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setErrorMsg(null);
        isLocationInitialized.current = true;
      } catch (error) {
        console.error("위치 조회 실패:", error);
        setErrorMsg(
          "현재 위치를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void initLocation();
  }, [isSummary, permission]);

  // 일반 맵: 위치 추적 (요약에서는 불필요)
  useEffect(() => {
    if (isSummary || permission !== true) return;

    const startWatch = async () => {
      if (locationSubscription.current) return;

      locationSubscription.current = await Location.watchPositionAsync(
        MAP_LOCATION_WATCH,
        (location) => {
          const { latitude, longitude } = location.coords;

          setCoordinates({ latitude, longitude });
          recordRunLocation(location.coords, "watch");

          const running = useRunStore.getState().isRunning;
          if (running && mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: DEFAULT_REGION.latitudeDelta,
                longitudeDelta: DEFAULT_REGION.longitudeDelta,
              },
              500,
            );
          }
        },
      );
    };

    void startWatch();

    return () => {
      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, [isSummary, permission]);

  // 추천 경로 선택 시 fit (요약 화면에서는 건너뜀)
  useEffect(() => {
    if (isSummary) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSummary, selectedRoute]);

  // 요약: 맵 준비 후 / 루트 변경 시 전체 경로로 고정
  useEffect(() => {
    if (!isSummary || !isMapReady.current || summaryRoute.length === 0) return;

    const frame = requestAnimationFrame(() => {
      fitSummaryRoute();
    });
    const timer = setTimeout(fitSummaryRoute, 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [isSummary, summaryRoute, fitSummaryRoute]);

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
        onMapReady={handleMapReady}
        onLayout={isSummary ? fitSummaryRoute : undefined}
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
        showsCompass={!isSummary}
        showsScale={!isSummary}
        mapType="standard"
        zoomEnabled={!isSummary}
        scrollEnabled={!isSummary}
        pitchEnabled={!isSummary}
        rotateEnabled={!isSummary}
        showsMyLocationButton={false}
        pointerEvents={isSummary ? "none" : "auto"}
      >
        {!isSummary && (
          <RunLocationMarker
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            heading={heading}
          />
        )}
        {children}
      </MapView>
      {!isSummary && (
        <TouchableOpacity
          onPress={moveToMyLocation}
          className="bottom-safe-offset-28 absolute right-3 rounded-full bg-white p-2.5 shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={24} color="#F25857" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleMap;
