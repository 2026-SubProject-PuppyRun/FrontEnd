import { magnetometerToHeading } from "@/util/map/compassHeading";
import {
  applyHeadingDeadzone,
  smoothHeading,
} from "@/util/map/headingFilter";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const UPDATE_INTERVAL_MS = 100;

/** EMA — 반응성 우선 */
const SMOOTH_ALPHA = 0.45;

/** UI 반영 최소 각도 */
const PUBLISH_DEADZONE_DEG = 2;

/** 샘플 스무딩 deadzone */
const SAMPLE_DEADZONE_DEG = 1;

export const useCompassHeading = (enabled: boolean) => {
  const [heading, setHeading] = useState(0);
  const filteredRef = useRef(0);
  const publishedRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let subscription: { remove: () => void } | null = null;
    let mounted = true;
    initializedRef.current = false;

    const start = async () => {
      const available = await Magnetometer.isAvailableAsync();
      if (!available || !mounted) return;

      Magnetometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = Magnetometer.addListener(({ x, y }) => {
        const raw = magnetometerToHeading(x, y);

        if (!initializedRef.current) {
          initializedRef.current = true;
          filteredRef.current = raw;
          publishedRef.current = raw;
          setHeading(raw);
          return;
        }

        const afterDeadzone = applyHeadingDeadzone(
          filteredRef.current,
          raw,
          SAMPLE_DEADZONE_DEG,
        );
        const smoothed = smoothHeading(
          filteredRef.current,
          afterDeadzone,
          SMOOTH_ALPHA,
        );
        filteredRef.current = smoothed;

        const publishCandidate = applyHeadingDeadzone(
          publishedRef.current,
          smoothed,
          PUBLISH_DEADZONE_DEG,
        );
        if (publishCandidate === publishedRef.current) return;

        publishedRef.current = publishCandidate;
        setHeading(publishCandidate);
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
