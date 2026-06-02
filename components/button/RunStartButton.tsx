import CustomAlert from "@/components/modal/CustomAlert";
import ConvexShadowSurface from "@/components/ui/ConvexShadowSurface";
import { RED_BUTTON_EFFECT } from "@/constants/redButtonEffect";
import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

interface RunStartButtonProps {
  disabled: boolean;
}

const RunStartButton = ({ disabled }: RunStartButtonProps) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const router = useRouter();

  if (disabled) return null;

  return (
    <>
      <View className="bottom-safe-offset-40 absolute left-0 right-0 z-20 flex-row items-center justify-center overflow-visible">
        <ConvexShadowSurface
          shadowPadding={8}
          className="-m-2"
          style={{ width: 100, height: 100 }}
          borderRadius={50}
          backgroundColor={RED_BUTTON_EFFECT.fill}
        >
          <Pressable
            onPress={() => setShowAlertDialog(true)}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="산책 시작"
          >
            <Ionicons name="play" size={47} color="white" className="pl-1" />
          </Pressable>
        </ConvexShadowSurface>
      </View>

      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={() => setShowAlertDialog(false)}
        title="산책을 시작해볼까요?"
        description={
          selectedRoute !== null
            ? "해당 경로로 안내를 시작합니다."
            : "추천 경로 없이 산책을 시작합니다."
        }
        onConfirm={() => {
          router.replace("/running/tracking");
        }}
        confirmText="시작하기"
        cancelText="그만두기"
      />
    </>
  );
};

export default RunStartButton;
