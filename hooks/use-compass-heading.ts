import { getShortestAngleDelta } from "@/util/map/markerHeading";
import { magnetometerToHeading } from "@/util/map/compassHeading";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const UPDATE_INTERVAL_MS = 200;
const MIN_HEADING_CHANGE_DEG = 2;

export const useCompassHeading = (enabled: boolean) => {
  const [heading, setHeading] = useState(0);
  const lastHeadingRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let subscription: { remove: () => void } | null = null;
    let mounted = true;

    const start = async () => {
      const available = await Magnetometer.isAvailableAsync();
      if (!available || !mounted) return;

      Magnetometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = Magnetometer.addListener(({ x, y }) => {
        const next = magnetometerToHeading(x, y);
        const delta = Math.abs(
          getShortestAngleDelta(lastHeadingRef.current, next),
        );
        if (delta < MIN_HEADING_CHANGE_DEG) return;

        lastHeadingRef.current = next;
        setHeading(next);
      });
    };

    void start();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [enabled]);

  return heading;
};
