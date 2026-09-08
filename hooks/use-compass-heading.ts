import { applyHeadingDeadzone, smoothHeading } from "@/util/map/headingFilter";
import {
  computeTiltCompensatedHeading,
  type Vec3,
} from "@/util/map/orientationHeading";
import { Accelerometer, Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const UPDATE_INTERVAL_MS = 100;

/** 중력 추출용 저역통과 — 걸을 때 발걸음 가속을 걸러낸다 */
const GRAVITY_ALPHA = 0.15;

/** 자력계 저역통과 */
const MAGNETIC_ALPHA = 0.25;

/** heading EMA */
const SMOOTH_ALPHA = 0.2;

/** UI 반영 최소 각도 */
const PUBLISH_DEADZONE_DEG = 4;

const lowPass = (previous: Vec3 | null, next: Vec3, alpha: number): Vec3 =>
  previous
    ? {
        x: previous.x + alpha * (next.x - previous.x),
        y: previous.y + alpha * (next.y - previous.y),
        z: previous.z + alpha * (next.z - previous.z),
      }
    : next;

/**
 * 지도 마커용 방위각.
 *
 * expo-location의 watchHeadingAsync는 SensorManager.getOrientation의 azimuth를
 * remapCoordinateSystem 없이 그대로 쓴다. azimuth는 기기 +Y축의 수평 투영
 * 방향이라, 화면을 보려고 폰을 세워 들면 +Y가 하늘을 향해 투영이 0에 수렴하고
 * 손목을 10°만 기울여도 100° 이상 튄다(gimbal lock).
 *
 * 그래서 가속도계·자력계를 직접 받아 기울기에 따라 기준축을 바꿔 계산한다.
 */
export const useCompassHeading = (enabled: boolean) => {
  const [heading, setHeading] = useState(0);
  const gravityRef = useRef<Vec3 | null>(null);
  const magneticRef = useRef<Vec3 | null>(null);
  const filteredRef = useRef(0);
  const publishedRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    gravityRef.current = null;
    magneticRef.current = null;
    initializedRef.current = false;

    const publish = () => {
      const gravity = gravityRef.current;
      const magnetic = magneticRef.current;
      if (!gravity || !magnetic) return;

      const raw = computeTiltCompensatedHeading(gravity, magnetic);
      if (raw === null) return;

      if (!initializedRef.current) {
        initializedRef.current = true;
        filteredRef.current = raw;
        publishedRef.current = raw;
        setHeading(raw);
        return;
      }

      const smoothed = smoothHeading(filteredRef.current, raw, SMOOTH_ALPHA);
      filteredRef.current = smoothed;

      const candidate = applyHeadingDeadzone(
        publishedRef.current,
        smoothed,
        PUBLISH_DEADZONE_DEG,
      );
      if (candidate === publishedRef.current) return;

      publishedRef.current = candidate;
      setHeading(candidate);
    };

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
    Magnetometer.setUpdateInterval(UPDATE_INTERVAL_MS);

    const accelerometer = Accelerometer.addListener((sample) => {
      gravityRef.current = lowPass(gravityRef.current, sample, GRAVITY_ALPHA);
    });

    // 자력계 쪽에서만 발행 — 두 센서 모두에서 계산하면 불필요하게 두 배로 돈다
    const magnetometer = Magnetometer.addListener((sample) => {
      magneticRef.current = lowPass(
        magneticRef.current,
        sample,
        MAGNETIC_ALPHA,
      );
      publish();
    });

    return () => {
      accelerometer.remove();
      magnetometer.remove();
    };
  }, [enabled]);

  return heading;
};
