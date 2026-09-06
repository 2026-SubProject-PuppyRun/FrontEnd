import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import { openPermissionModal } from "@/store/usePermissionModalStore";

type PermissionState = boolean | null;

let sharedGranted: PermissionState = null;
const listeners = new Set<(value: PermissionState) => void>();
let inFlight: Promise<PermissionState> | null = null;
let hasPromptedSettings = false;

const notify = (value: PermissionState) => {
  sharedGranted = value;
  listeners.forEach((listener) => listener(value));
};

const openSettingsAlert = () => {
  if (hasPromptedSettings) return;
  hasPromptedSettings = true;

  openPermissionModal({
    kind: "location",
    onConfirm: () => {
      Linking.openSettings();
    },
    onCancel: () => {
      hasPromptedSettings = false;
    },
  });
};

/**
 * 위치 권한 동기화.
 * - requestIfNeeded: 시스템 다이얼로그 요청 여부
 * - 설정에서 허용 후 복귀 시 request 없이 get만으로 반영
 */
export const syncLocationPermission = async (
  requestIfNeeded = false,
): Promise<PermissionState> => {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      let permission = await Location.getForegroundPermissionsAsync();

      if (
        permission.status !== "granted" &&
        requestIfNeeded &&
        permission.canAskAgain
      ) {
        permission = await Location.requestForegroundPermissionsAsync();
      }

      if (permission.status === "granted") {
        hasPromptedSettings = false;
        notify(true);
        return true;
      }

      notify(false);

      // 다시 물을 수 없으면 설정 유도 (요청 흐름에서만)
      if (requestIfNeeded && !permission.canAskAgain) {
        openSettingsAlert();
      }

      return false;
    } catch (error) {
      console.error("위치 권한 오류:", error);
      notify(false);
      return false;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};

/**
 * 앱 전역에서 동일 권한 상태를 공유.
 * 홈/맵이 각각 마운트돼도 중복 요청하지 않음.
 */
export const useLocationPermission = () => {
  const [granted, setGranted] = useState<PermissionState>(sharedGranted);

  const refresh = useCallback(async (requestIfNeeded = false) => {
    return syncLocationPermission(requestIfNeeded);
  }, []);

  useEffect(() => {
    const listener = (value: PermissionState) => setGranted(value);
    listeners.add(listener);
    setGranted(sharedGranted);

    // 최초 1회: 필요하면 시스템 권한 팝업
    void syncLocationPermission(sharedGranted !== true);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;
      // 설정에서 허용하고 돌아온 경우를 반영 (팝업 없이 재조회)
      void syncLocationPermission(false);
    });

    return () => {
      listeners.delete(listener);
      subscription.remove();
    };
  }, []);

  return granted;
};

export const requestLocationPermission = () =>
  syncLocationPermission(true);
