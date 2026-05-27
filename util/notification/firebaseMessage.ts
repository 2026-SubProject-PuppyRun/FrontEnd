import { getApp } from "@react-native-firebase/app";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;
let backgroundHandlerRegistered = false;

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

export { getFirebaseMessaging };

const submitNotificationToBackend = async (tokenString: string) => {
  try {
    const response = await fetch(
      "https://maybell-unelicitable-uninterestingly.ngrok-free.dev/api/admin/notice/send-push?title=푸푸런 알림&body=푸푸런에서 새로운 알림이 도착했습니다.&fcmToken=" +
        tokenString,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_TEM_ADMIN_KEY}`,
        },
      },
    );
    console.log("백엔드 API 호출 결과 상태:", response.status);
  } catch (error) {
    console.error("백엔드 API 호출 실패:", error);
  }
};
