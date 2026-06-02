import { useRunStore } from "@/store/useRunStore";
import { formatTime } from "@/util/run";
import { getPathLength } from "geolib";
import React, { useEffect, useState } from "react";
import { Box } from "../../ui/box";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { View } from "../../ui/view";

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
    if (!isMapLoaded) return;
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
  }, [isRunning, startTime, accumulatedMs, isPaused, isMapLoaded]);

  if (!isMapLoaded) return null;

  const totalDistance = getPathLength(flatRoute);

  return (
    <View className="top-safe-offset-20 absolute z-10 w-full items-center">
      <HStack space="4xl">
        <Box className="items-center gap-2">
          <Text size="4xl" bold className="font-bold italic text-primary-500">
            {pace}
          </Text>
          <Text size="xl" bold className="font-semibold text-primary-500">
            Face
          </Text>
        </Box>
        <Box className="items-center gap-2">
          <Text size="4xl" bold className="font-bold italic text-primary-500">
            {(totalDistance / 1000).toFixed(2)}km
          </Text>
          <Text size="xl" bold className="font-semibold text-primary-500">
            Distance
          </Text>
        </Box>
        <Box className="items-center gap-2">
          <Text size="4xl" bold className="font-bold italic text-primary-500">
            {formatTime(elapsedTime)}
          </Text>
          <Text size="xl" bold className="font-semibold text-primary-500">
            Time
          </Text>
        </Box>
      </HStack>
    </View>
  );
};

export default RunDataBoard;
