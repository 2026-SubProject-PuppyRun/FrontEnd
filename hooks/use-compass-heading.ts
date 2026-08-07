import { magnetometerToHeading } from "@/util/map/compassHeading";
import {
  applyHeadingDeadzone,
  smoothHeading,
} from "@/util/map/headingFilter";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

/** 센서 샘플 주기 — 너무 잦으면 노이즈만 늘어남 */
const UPDATE_INTERVAL_MS = 350;

/** EMA 계수 (작을수록 둔함) */
const SMOOTH_ALPHA = 0.18;

/** 이보다 작은 변화는 UI에 반영하지 않음 */
const PUBLISH_DEADZONE_DEG = 6;

/** 연속 샘플 내부 스무딩용 deadzone */
const SAMPLE_DEADZONE_DEG = 3;

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
