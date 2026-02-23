import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Button } from "../ui/button";
import { View } from "../ui/view";

interface RunControlButtonProps {
  isMapLoaded: boolean;
}

const RunControlButton = ({ isMapLoaded }: RunControlButtonProps) => {
  const pauseRun = useRunStore((state) => state.pauseRun);
  const resumeRun = useRunStore((state) => state.resumeRun);
  const stopRun = useRunStore((state) => state.stopRun);
  const isPaused = useRunStore((state) => state.isPaused);
  const router = useRouter();
  if (!isMapLoaded) return null;

  return (
    <>
      {!isPaused ? (
        <Button
          size="md"
          className="bottom-safe-offset-40 absolute right-1/2 h-28 w-28 translate-x-1/2 items-center justify-center rounded-full "
          onPress={pauseRun}
        >
          <Ionicons name="pause" size={30} color="white" />
        </Button>
      ) : (
        <View className="bottom-safe-offset-40 absolute right-1/2 w-screen translate-x-1/2 flex-row items-center justify-center gap-14">
          <Button onPress={resumeRun} className="h-28 w-28 rounded-full">
            <Ionicons name="play" size={30} color="white" />
          </Button>
          <Button
            onPress={() => {
              stopRun();
              router.replace("/running/summary");
            }}
            className="h-28 w-28 rounded-full"
          >
            <Ionicons name="stop" size={30} color="white" />
          </Button>
        </View>
      )}
    </>
  );
};

export default RunControlButton;
