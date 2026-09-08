import { applyHeadingDeadzone, smoothHeading } from "@/util/map/headingFilter";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

/** EMA — 융합 센서라 원시 자력계보다 낮게 잡아도 반응성이 유지됨 */
const SMOOTH_ALPHA = 0.2;

/** UI 반영 최소 각도 */
const PUBLISH_DEADZONE_DEG = 4;

/** 이 값 미만이면 나침반 미보정 (3=높음, 0=오차 50°↑) */
const LOW_ACCURACY_THRESHOLD = 2;

/**
 * 지도 마커용 방위각.
 *
 * 자력계 원시값 대신 OS 융합 나침반을 사용한다.
 * - 기울기 보정: 손에 들고 걸을 때 pitch/roll로 각도가 튀지 않음
 * - trueHeading: 자편각까지 보정된 진북 기준 (위치 권한 필요, 없으면 -1)
 */
export const useCompassHeading = (enabled: boolean) => {
  const [heading, setHeading] = useState(0);
  const filteredRef = useRef(0);
  const publishedRef = useRef(0);
  const initializedRef = useRef(false);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;
    initializedRef.current = false;
    warnedRef.current = false;

    const handleSample = (sample: Location.LocationHeadingObject) => {
      const raw =
        sample.trueHeading >= 0 ? sample.trueHeading : sample.magHeading;
      if (raw < 0) return;

      if (sample.accuracy < LOW_ACCURACY_THRESHOLD && !warnedRef.current) {
        warnedRef.current = true;
        console.warn(
          `나침반 정확도 낮음 (accuracy=${sample.accuracy}) — 기기 보정 또는 자기 간섭 확인 필요`,
        );
      }

      if (!initializedRef.current) {
        initializedRef.current = true;
        filteredRef.current = raw;
        publishedRef.current = raw;
        setHeading(raw);
        return;
      }

      const smoothed = smoothHeading(filteredRef.current, raw, SMOOTH_ALPHA);
      filteredRef.current = smoothed;

      const publishCandidate = applyHeadingDeadzone(
        publishedRef.current,
        smoothed,
        PUBLISH_DEADZONE_DEG,
      );
      if (publishCandidate === publishedRef.current) return;

      publishedRef.current = publishCandidate;
      setHeading(publishCandidate);
    };

    const start = async () => {
      try {
        const next = await Location.watchHeadingAsync(handleSample);
        if (!mounted) {
          next.remove();
          return;
        }
        subscription = next;
      } catch (error) {
        console.error("나침반 구독 실패:", error);
      }
    };

    void start();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [enabled]);

  return heading;
};
