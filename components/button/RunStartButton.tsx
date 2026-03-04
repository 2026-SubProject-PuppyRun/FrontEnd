import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import CustomAlert from "../modal/CustomAlert";
import { Button } from "../ui/button";
import { Center } from "../ui/center";

interface RunStartButtonProps {
  disabled: boolean;
}

const RunStartButton = ({ disabled }: RunStartButtonProps) => {
  const [disabledRoute, setDisabledRoute] = useState(false);
  const setSelectedRoute = useRunStore((state) => state.setSelectedRoute);
  const recommendedRoutes = useRunStore((state) => state.recommendedRoutes);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const selectedRoute = useRunStore((state) => state.selectedRoute);

  const router = useRouter();
  if (disabled) return null;
  return (
    <>
      <Center className="absolute bottom-12 right-1/2 h-1/5 w-96 translate-x-1/2 flex-row rounded-3xl bg-primary-400">
        <Button
          className={`h-28 w-28 rounded-full bg-primary-200 data-[active=true]:bg-primary-300 `}
          onPress={() => {
            setShowAlertDialog(true);
          }}
        >
          <Ionicons name="paw" size={32} color={`#A69A88`} />
        </Button>
        <Button
          className={`absolute left-[50%] ml-20 h-16 w-16 rounded-full bg-primary-200 data-[active=true]:bg-primary-300 `}
          onPress={() => {
            const newDisabledState = !disabledRoute;

            setDisabledRoute(newDisabledState);

            if (newDisabledState) {
              setSelectedRoute(null);
            } else {
              const firstRoute = recommendedRoutes
                ? recommendedRoutes[0]
                : null;
              setSelectedRoute(firstRoute);
            }
          }}
        >
          {!disabledRoute ? (
            <Ionicons name="golf" size={18} color={`#A69A88`} />
          ) : (
            <Ionicons name="golf-outline" size={18} color={`gray`} />
          )}
        </Button>
      </Center>
      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={handleClose}
        title="산책을 시작해볼까요?"
        description={
          selectedRoute !== null
            ? `해당 경로로 안내를 시작합니다.`
            : "추천 경로 없이 산책을 시작합니다."
        }
        onConfirm={() => {
          useRunStore.getState().startRun();
          router.replace("/running/tracking");
        }}
        confirmText="시작하기"
        cancelText="그만두기"
      />
    </>
  );
};

export default RunStartButton;
