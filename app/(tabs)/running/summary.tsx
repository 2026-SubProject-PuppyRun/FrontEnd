import RunResultBoard from "@/components/board/RunBoard/RunResultBoard";
import SelfieButton from "@/components/button/SelfieButton";
import GoogleMap from "@/components/map/GoogleMap";
import RunRoutePolyline from "@/components/map/RunRoutePolyline";
import CustomAlert from "@/components/modal/CustomAlert";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_WIDTH = 112;
const LOGO_HEIGHT = 30;

const Summary = () => {
  const insets = useSafeAreaInsets();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const routeData = useRunStore((state) => state.runData?.route);
  const finalRoute = routeData ?? [];
  const navigation = useNavigation();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const isIntentionalExit = useRef(false);

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
    <View
      style={{ paddingBottom: insets.bottom + 90 }}
      className="flex-1 bg-white"
    >
      <View className="relative min-h-0 flex-1">
        <GoogleMap
          onMapLoad={() => setIsMapLoaded(true)}
          isSummary={true}
          style="dark"
          fitEdgePadding={{
            top: insets.top + LOGO_HEIGHT + 24,
            right: LOGO_WIDTH + 32,
            bottom: 48,
            left: 48,
          }}
        >
          {isMapLoaded && finalRoute.length > 0 && (
            <RunRoutePolyline
              coordinates={finalRoute.map((coord) => ({
                latitude: coord.latitude,
                longitude: coord.longitude,
              }))}
              showEndpoints
            />
          )}
        </GoogleMap>

        <View
          pointerEvents="none"
          className="absolute right-4 z-10"
          style={{ top: insets.top + 8 }}
        >
          <RunLogoSvg width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </View>
      </View>

      <View className="border-t border-gray-100 bg-white px-4 pb-4 pt-3">
        <View className="flex-row items-center gap-3">
          <RunResultBoard variant="strip" />
          <SelfieButton size={72} />
        </View>
      </View>

      <CustomAlert
        showAlertDialog={showAlert}
        handleClose={() => setShowAlert(false)}
        title="저장 취소"
        description="결과 저장을 정말 취소하시겠습니까? 기록이 저장되지 않을 수 있습니다."
        onConfirm={() => {
          isIntentionalExit.current = true;
          useRunStore.getState().resetRunSession();
          router.replace("/");
        }}
        confirmText="종료"
        cancelText="취소"
      />
    </View>
  );
};

export default Summary;
