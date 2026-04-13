import CountDown from "@/components/board/RunBoard/CountDown";
import RunDataBoard from "@/components/board/RunBoard/RunDataBoard";
import TipBoard from "@/components/board/RunBoard/TipBoard";
import RunControlButton from "@/components/button/RunControlButton";
import GoogleMap from "@/components/map/GoogleMap";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunTracking } from "@/hooks/use-run-tracking";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tracking = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const actualRoute = useRunStore((state) => state.actualRoute);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startRun = useRunStore((state) => state.startRun);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (isMapLoaded && isComplete && !hasStarted.current) {
      hasStarted.current = true;
      startRun();
    }
  }, [isMapLoaded, isComplete, startRun]);

  useEffect(() => {
    const onBackPress = () => {
      if (!useRunStore.getState().isRunning) return false;
      return true;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!useRunStore.getState().isRunning) {
        return;
      }

      e.preventDefault();
    });

    return () => {
      backHandlerSubscription.remove();
      unsubscribe();
    };
  }, [navigation]);

  useNonNavbar();

  useRunTracking();
  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="relative flex-1 bg-white"
    >
      {!isComplete && <CountDown onComplete={() => setIsComplete(true)} />}
      <RunDataBoard isMapLoaded={isMapLoaded} />
      <GoogleMap
        onMapLoad={() => {
          setIsMapLoaded(true);
        }}
      >
        {selectedRoute && (
          <Polyline
            coordinates={selectedRoute}
            strokeWidth={4}
            strokeColor="#FF0000"
          />
        )}
        {actualRoute.map(
          (segment, index) =>
            segment.length > 0 && (
              <Polyline
                key={`run-${index}`}
                coordinates={segment}
                strokeWidth={4}
                strokeColor="#0000FF"
              />
            ),
        )}

        {actualRoute.map((segment, index) => {
          if (index >= actualRoute.length - 1) return null;

          const currentEnd = segment[segment.length - 1];
          const nextStart = actualRoute[index + 1][0];

          if (!currentEnd || !nextStart) return null;

          return (
            <Polyline
              key={`gap-${index}`}
              coordinates={[currentEnd, nextStart]}
              strokeWidth={3}
              strokeColor="#999999"
              lineDashPattern={[5, 5]}
            />
          );
        })}
      </GoogleMap>
      <RunControlButton isMapLoaded={isMapLoaded} />
      <TipBoard isMapLoaded={isMapLoaded} />
    </View>
  );
};

export default Tracking;
