import { getApp } from "@react-native-firebase/app";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messaging = getMessaging(getApp());

// FCM 토큰 가져오기
export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging);
    console.log("FCM Token:", token);
    // submitNotificationToBackendTest(token); // 백엔드로 FCM 토큰 전송
    return token;
  } catch (error) {
    console.error("FCM Token 가져오기 실패:", error);
  }
};

// 알림 권한 요청
export const requestUserPermission = async () => {
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("푸시 알림 권한 승인됨");
  }
};

// Background & Quit 상태 알림 수신
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log("💌 Message handled in the background!", remoteMessage);
});

const submitNotificationToBackendTest = async (tokenString: string) => {
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
