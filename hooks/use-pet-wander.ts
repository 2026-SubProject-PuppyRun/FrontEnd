import { useCallback, useEffect, useRef, useState } from "react";
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface WanderBounds {
  width: number;
  height: number;
}

interface UsePetWanderOptions {
  bounds: WanderBounds;
  petIndex: number;
}

const WANDER_SPEED_PX_PER_MS = 0.06;
const IDLE_PAUSE_MS = 1200;

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const usePetWander = ({ bounds, petIndex }: UsePetWanderOptions) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const facingLeft = useSharedValue(false);
  const [isWalking, setIsWalking] = useState(false);

  const cancelledRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLegComplete = useCallback(() => {
    setIsWalking(false);
    if (cancelledRef.current) return;
    timeoutRef.current = setTimeout(() => {
      scheduleNextLegRef.current?.();
    }, IDLE_PAUSE_MS);
  }, []);

  const scheduleNextLegRef = useRef<() => void>(() => {});

  useEffect(() => {
    cancelledRef.current = false;

    if (bounds.width <= 0 || bounds.height <= 0) {
      return () => {
        cancelledRef.current = true;
      };
    }

    const maxX = bounds.width;
    const maxY = bounds.height;

    const scheduleNextLeg = () => {
      if (cancelledRef.current) return;

      const startX = x.value;
      const startY = y.value;
      const targetX = randomBetween(0, maxX);
      const targetY = randomBetween(0, maxY);
      const dx = targetX - startX;
      const dy = targetY - startY;
      const distance = Math.hypot(dx, dy);

      if (distance < 8) {
        setIsWalking(false);
        timeoutRef.current = setTimeout(scheduleNextLeg, IDLE_PAUSE_MS);
        return;
      }

      facingLeft.value = dx < 0;
      setIsWalking(true);

      const duration = Math.min(distance / WANDER_SPEED_PX_PER_MS, 6000);
      const timingConfig = { duration, easing: Easing.linear };

      y.value = withTiming(targetY, timingConfig);
      x.value = withTiming(targetX, timingConfig, (finished) => {
        "worklet";
        if (!finished) return;
        runOnJS(onLegComplete)();
      });
    };

    scheduleNextLegRef.current = scheduleNextLeg;

    x.value = randomBetween(0, maxX);
    y.value = randomBetween(0, maxY);
    setIsWalking(false);

    const startDelay = 400 + petIndex * 350;
    timeoutRef.current = setTimeout(scheduleNextLeg, startDelay);

    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [bounds.width, bounds.height, petIndex, facingLeft, onLegComplete, x, y]);

  return { x, y, facingLeft, isWalking };
};
