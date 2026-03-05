import RunResultBoard from "@/components/board/RunResultBoard";
import SelfieButton from "@/components/button/SelfieButton";
import GoogleMap from "@/components/map/GoogleMap";
import CustomAlert from "@/components/modal/CustomAlert";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Summary = () => {
  const insets = useSafeAreaInsets();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const routeData = useRunStore((state) => state.runData?.route);
  const finalRoute = routeData ?? [];
  const navigation = useNavigation();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const isIntentionalExit = useRef(false);

  useNonNavbar();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isIntentionalExit.current) {
        return;
      }

      e.preventDefault();
      setShowAlert(true);
    });
    return unsubscribe;
  }, [navigation]);

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
      <CustomAlert
        showAlertDialog={showAlert}
        handleClose={() => setShowAlert(false)}
        title="저장 취소"
        description="결과 저장을 정말 취소하시겠습니까? 기록이 저장되지 않을 수 있습니다."
        onConfirm={() => {
          isIntentionalExit.current = true;
          useRunStore.getState().resetRunData();
          router.replace("/");
        }}
        confirmText="종료"
        cancelText="취소"
      />
    </View>
  );
};

export default Summary;
