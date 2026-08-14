import { getAccessToken } from "@/util/api/core";
import { ApiError } from "@/util/api/core/errors";
import {
  registerFcmToken,
  registerNotificationConsent,
} from "@/util/api/notifications";
import { getApp } from "@react-native-firebase/app";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;
let backgroundHandlerRegistered = false;
let tokenRefreshUnsubscribe: (() => void) | null = null;

const getFirebaseMessaging = () => {
  if (!messagingInstance) {
    messagingInstance = getMessaging(getApp());
  }
  return messagingInstance;
};

const registerBackgroundHandler = () => {
  if (backgroundHandlerRegistered) return;
  try {
    setBackgroundMessageHandler(
      getFirebaseMessaging(),
      async (remoteMessage) => {
        console.log("💌 Message handled in the background!", remoteMessage);
      },
    );
    backgroundHandlerRegistered = true;
  } catch (error) {
    console.warn("FCM background handler 등록 실패:", error);
  }
};

const ensureAccessToken = () => {
  if (!getAccessToken()) {
    console.warn("Access Token이 없어 알림 서버 등록을 건너뜁니다.");
    return false;
  }
  return true;
};

/** 기존 알림 설정의 FCM 토큰 교체 */
export const submitFcmTokenToBackend = async (token: string) => {
  const trimmed = token.trim();
  if (!trimmed) {
    console.warn("FCM 토큰이 비어 있어 서버 등록을 건너뜁니다.");
    return;
  }
  if (!ensureAccessToken()) return;

  await registerFcmToken(trimmed);
};

/**
 * 푸시 허용 시 최초 동의 등록
 * - 성공: /notifications/agree
 * - 이미 등록됨(409): /notifications/fcm-token 으로 토큰 교체
 */
export const registerPushConsentOnAllow = async () => {
  if (!ensureAccessToken()) return;

  const token = await getFCMToken();
  if (!token?.trim()) {
    console.warn("FCM 토큰이 없어 알림 동의 등록을 건너뜁니다.");
    return;
  }

  try {
    await registerNotificationConsent(true, token);
    console.log("알림 동의 및 FCM 토큰 최초 등록 완료");
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      await registerFcmToken(token);
      console.log("알림 설정이 이미 있어 FCM 토큰을 갱신했습니다.");
      return;
    }
    throw error;
  }
};

// FCM 토큰 가져오기
export const getFCMToken = async () => {
  try {
    registerBackgroundHandler();
    const token = await getToken(getFirebaseMessaging());
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("FCM Token 가져오기 실패:", error);
  }
};

/** 알림 권한 요청 — 허용 여부 반환 */
export const requestUserPermission = async () => {
  try {
    const authStatus = await requestPermission(getFirebaseMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("푸시 알림 권한 승인됨");
    }
    return enabled;
  } catch (error) {
    console.warn("FCM 권한 요청 실패:", error);
    return false;
  }
};

/** 토큰 갱신 시 기존 설정의 토큰만 교체 */
export const subscribeFcmTokenRefresh = () => {
  if (tokenRefreshUnsubscribe) return tokenRefreshUnsubscribe;

  try {
    tokenRefreshUnsubscribe = onTokenRefresh(
      getFirebaseMessaging(),
      async (token) => {
        try {
          await submitFcmTokenToBackend(token);
        } catch (error) {
          if (error instanceof ApiError && error.isNotFound) {
            console.warn(
              "알림 설정이 없어 갱신 토큰 등록을 건너뜁니다. 푸시 허용 시 /agree 로 최초 등록하세요.",
            );
            return;
          }
          console.warn("갱신된 FCM 토큰 서버 등록 실패:", error);
        }
      },
    );
  } catch (error) {
    console.warn("FCM 토큰 갱신 리스너 등록 실패:", error);
  }

  return tokenRefreshUnsubscribe;
};

export { getFirebaseMessaging };
