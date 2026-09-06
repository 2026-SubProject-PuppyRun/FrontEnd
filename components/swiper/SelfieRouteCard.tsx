import RouteSvg from "@/components/svg/RouteSvg";
import { useRunStore } from "@/store/useRunStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useEffect, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";

type RouteCoordinate = {
  latitude: number;
  longitude: number;
};

export type SelfieRouteStats = {
  pace: string;
  distanceLabel: string;
  timeLabel: string;
};

type SelfieRouteCardProps = {
  selfieImgUrl?: string;
  routeImgUrl?: string;
  /** 피드 등에서 좌표로 루트 SVG를 그릴 때 */
  route?: RouteCoordinate[] | null;
  /** 셀피 하단 오버레이 러닝 결과 */
  stats?: SelfieRouteStats | null;
  /** 러닝 직후 루트 이미지 캡처 여부 (기본: 라이브 루트일 때 캡처) */
  captureRoute?: boolean;
};

const StatItem = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <View className="flex-1 items-center">
    <Text className="text-[17px] font-bold italic text-white">{value}</Text>
    <Text className="mt-0.5 text-[11px] font-semibold text-white/75">
      {label}
    </Text>
  </View>
);

const SelfieRouteCard = ({
  selfieImgUrl,
  routeImgUrl,
  route: routeProp,
  stats,
  captureRoute = true,
}: SelfieRouteCardProps) => {
  const runSelfieUri = useRunStore((state) => state.runData?.selfie);
  const storeRoute = useRunStore((state) => state.runData?.route);
  const existingRouteImg = useRunStore((state) => state.runData?.routeImg);

  const selfieUri = selfieImgUrl || runSelfieUri || "";
  const routeCoords = routeProp ?? storeRoute;
  const hasRouteCoords = Boolean(routeCoords && routeCoords.length > 1);
  const overlayRouteImg =
    routeImgUrl || (!hasRouteCoords ? existingRouteImg : null);

  const width = Dimensions.get("window").width;
  const cardWidth = Math.min(width - 48, 360);
  const cardHeight = cardWidth * (5 / 4);
  const routeSize = Math.round(cardWidth * 0.36);

  const routeRef = useRef<View>(null);
  const shouldCaptureLiveRoute =
    captureRoute && !routeProp && Boolean(storeRoute && storeRoute.length > 1);

  useEffect(() => {
    if (!shouldCaptureLiveRoute || routeImgUrl || existingRouteImg) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        if (!routeRef.current) return;
        const uri = await captureRef(routeRef, {
          format: "png",
          quality: 1,
          result: "tmpfile",
        });
        useRunStore.getState().addRunData({ routeImg: uri });
      } catch (error) {
        console.error("루트 캡처 에러:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [shouldCaptureLiveRoute, routeImgUrl, existingRouteImg]);

  let routeOverlay: ReactNode = null;
  if (hasRouteCoords) {
    routeOverlay = (
      <View ref={routeRef} collapsable={false}>
        <RouteSvg
          route={routeCoords}
          size={routeSize}
          padding={10}
          withBackground={false}
          withOutline
          strokeWidth={4}
        />
      </View>
    );
  } else if (overlayRouteImg) {
    routeOverlay = (
      <Image
        source={{ uri: overlayRouteImg }}
        style={{ width: routeSize, height: routeSize, opacity: 0.92 }}
        contentFit="contain"
      />
    );
  }

  return (
    <View className="items-center px-6">
      <View
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: "#E5E7EB",
        }}
      >
        {selfieUri ? (
          <Image
            source={{ uri: selfieUri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
        ) : null}

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(13, 15, 27, 0.12)" },
          ]}
        />

        {routeOverlay ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
            }}
          >
            {routeOverlay}
          </View>
        ) : null}

        {stats ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <LinearGradient
              colors={["transparent", "rgba(13,15,27,0.55)", "rgba(13,15,27,0.82)"]}
              locations={[0, 0.45, 1]}
              style={{ paddingHorizontal: 12, paddingTop: 36, paddingBottom: 16 }}
            >
              <View className="flex-row items-center justify-between">
                <StatItem value={stats.pace} label="Pace" />
                <View className="h-7 w-px bg-white/25" />
                <StatItem value={stats.distanceLabel} label="Distance" />
                <View className="h-7 w-px bg-white/25" />
                <StatItem value={stats.timeLabel} label="Time" />
              </View>
            </LinearGradient>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default SelfieRouteCard;
