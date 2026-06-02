import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

interface RunControlButtonProps {
  isMapLoaded: boolean;
}

const CONTROL_SIZE = 100;
const CONTROL_RADIUS = CONTROL_SIZE / 2;

interface ControlCircleButtonProps {
  onPress: () => void;
  icon: "pause" | "play" | "stop";
  accessibilityLabel: string;
}

const ControlCircleButton = ({
  onPress,
  icon,
  accessibilityLabel,
}: ControlCircleButtonProps) => (
  <RedButtonSurface
    borderRadius={CONTROL_RADIUS}
    backgroundColor={"#ffffff"}
    shadowPadding={8}
    style={{ width: CONTROL_SIZE, height: CONTROL_SIZE }}
  >
    <Pressable
      onPress={onPress}
      className="h-full w-full items-center justify-center"
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={50} color="#F25857" />
    </Pressable>
  </RedButtonSurface>
);

const RunControlButton = ({ isMapLoaded }: RunControlButtonProps) => {
  const pauseRun = useRunStore((state) => state.pauseRun);
  const resumeRun = useRunStore((state) => state.resumeRun);
  const stopRun = useRunStore((state) => state.stopRun);
  const isPaused = useRunStore((state) => state.isPaused);
  const router = useRouter();

  if (!isMapLoaded) return null;

  return (
    <View className="bottom-safe-offset-40 absolute left-0 right-0 z-20 items-center overflow-visible">
      {!isPaused ? (
        <ControlCircleButton
          onPress={pauseRun}
          icon="pause"
          accessibilityLabel="일시정지"
        />
      ) : (
        <View className="flex-row items-center gap-14">
          <ControlCircleButton
            onPress={resumeRun}
            icon="play"
            accessibilityLabel="재개"
          />
          <ControlCircleButton
            onPress={() => {
              if (useRunStore.getState().runData?.route?.length === 0) {
                alert("러닝 경로가 없습니다. 러닝을 종료할 수 없습니다.");
                return;
              }
              stopRun();
              router.replace("/running/summary");
            }}
            icon="stop"
            accessibilityLabel="종료"
          />
        </View>
      )}
    </View>
  );
};

export default RunControlButton;
