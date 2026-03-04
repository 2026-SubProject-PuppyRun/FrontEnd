import RunDataBoard from "@/components/board/RunDataBoard";
import TipBoard from "@/components/board/TipBoard";
import RunControlButton from "@/components/button/RunControlButton";
import GoogleMap from "@/components/map/GoogleMap";
import CustomAlert from "@/components/modal/CustomAlert";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunTracking } from "@/hooks/use-run-tracking";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tracking = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const actualRoute = useRunStore((state) => state.actualRoute);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!useRunStore.getState().isRunning) return;
      e.preventDefault();

      setShowAlert(true);
    });
    return unsubscribe;
  }, [navigation]);

  useNonNavbar();

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
      <CustomAlert
        showAlertDialog={showAlert}
        handleClose={() => setShowAlert(false)}
        title="러닝 종료"
        description="러닝을 정말 종료하시겠습니까? 기록이 저장되지 않을 수 있습니다."
        onConfirm={() => {
          useRunStore.getState().stopRun();
          useRunStore.getState().resetRunData();
          router.replace("/");
        }}
        confirmText="종료"
        cancelText="취소"
      />
    </View>
  );
};

export default Tracking;
