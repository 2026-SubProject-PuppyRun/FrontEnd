import { getApp } from "@react-native-firebase/app";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { registerFcmToken } from "@/util/api/notifications";
import { getAccessToken } from "@/util/api/core";

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
    setBackgroundMessageHandler(getFirebaseMessaging(), async (remoteMessage) => {
      console.log("💌 Message handled in the background!", remoteMessage);
    });
    backgroundHandlerRegistered = true;
  } catch (error) {
    console.warn("FCM background handler 등록 실패:", error);
  }
};

/** 서버에 FCM 토큰 등록 (Bearer 인증 필요) */
export const submitFcmTokenToBackend = async (token: string) => {
  const trimmed = token.trim();
  if (!trimmed) {
    console.warn("FCM 토큰이 비어 있어 서버 등록을 건너뜁니다.");
    return;
  }

  if (!getAccessToken()) {
    console.warn("Access Token이 없어 FCM 토큰 서버 등록을 건너뜁니다.");
    return;
  }

  await registerFcmToken(trimmed);
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

// 알림 권한 요청
export const requestUserPermission = async () => {
  try {
    const authStatus = await requestPermission(getFirebaseMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("푸시 알림 권한 승인됨");
    }
  } catch (error) {
    console.warn("FCM 권한 요청 실패:", error);
  }
};

/** 토큰 갱신 시 서버에 재등록 */
export const subscribeFcmTokenRefresh = () => {
  if (tokenRefreshUnsubscribe) return tokenRefreshUnsubscribe;

  try {
    tokenRefreshUnsubscribe = onTokenRefresh(
      getFirebaseMessaging(),
      async (token) => {
        try {
          await submitFcmTokenToBackend(token);
        } catch (error) {
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
