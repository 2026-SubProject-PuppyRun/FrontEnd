import { useRunStore } from "@/store/useRunStore";
import { getPathLength } from "geolib";
import React, { useEffect, useState } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { View } from "../ui/view";

interface RunDataBoardProps {
  isMapLoaded: boolean;
}

const RunDataBoard = ({ isMapLoaded }: RunDataBoardProps) => {
  const pace = useRunStore((state) => state.runData?.pace ?? 0);
  const actualRoute = useRunStore((state) => state.actualRoute);
  const startTime = useRunStore((state) => state.runData?.startTime);
  const isRunning = useRunStore((state) => state.isRunning);
  const accumulatedMs = useRunStore(
    (state) => state.runData?.accumulatedMs ?? 0,
  );
  const isPaused = useRunStore((state) => state.isPaused);
  const flatRoute = actualRoute.flat();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning && !isPaused && startTime) {
      const updateTimer = () => {
        const now = Date.now();
        const currentSegmentMs = now - startTime;
        setElapsedTime(Math.floor((accumulatedMs + currentSegmentMs) / 1000));
      };

      updateTimer();
      intervalId = setInterval(updateTimer, 1000);
    } else if (isRunning && isPaused) {
      setElapsedTime(Math.floor(accumulatedMs / 1000));
    } else {
      setElapsedTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startTime, accumulatedMs, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isMapLoaded) return null;

  const totalDistance = getPathLength(flatRoute);

  return (
    <View className="top-safe-offset-12 absolute z-10 w-full items-center">
      <HStack space="4xl">
        <Box className="items-center gap-12">
          <Text size="3xl" bold className="color-black">
            {pace}
          </Text>
          <Text size="3xl" bold className="color-gray-700">
            페이스
          </Text>
        </Box>
        <Box className="items-center gap-12">
          <Text size="3xl" bold className="color-black">
            {(totalDistance / 1000).toFixed(2)}km
          </Text>
          <Text size="3xl" bold className="color-gray-700">
            거리
          </Text>
        </Box>
        <Box className="items-center gap-12">
          <Text size="3xl" bold className="color-black">
            {formatTime(elapsedTime)}
          </Text>
          <Text size="3xl" bold className="color-gray-700">
            시간
          </Text>
        </Box>
      </HStack>
    </View>
  );
};

export default RunDataBoard;
