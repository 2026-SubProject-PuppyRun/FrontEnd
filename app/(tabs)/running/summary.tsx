import RunResultBoard from "@/components/board/RunResultBoard";
import SelfieButton from "@/components/button/SelfieButton";
import GoogleMap from "@/components/map/GoogleMap";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Summary = () => {
  const insets = useSafeAreaInsets();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const finalRoute = useRunStore((state) => state.runData?.route ?? []);
  const navigation = useNavigation();
  const router = useRouter();
  useNonNavbar();
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      Alert.alert(
        "저장 취소",
        "결과 저장을 정말 취소하시겠습니까? 기록이 저장되지 않을 수 있습니다.",
        [
          { text: "취소", style: "cancel", onPress: () => {} },
          {
            text: "종료",
            style: "destructive",
            onPress: () => {
              useRunStore.getState().resetRunData();
              router.replace("/");
            },
          },
        ],
      );
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    </View>
  );
};

export default Summary;
