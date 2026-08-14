import {
  getFCMToken,
  requestUserPermission,
  submitFcmTokenToBackend,
  subscribeFcmTokenRefresh,
} from "./firebaseMessage";

export const initFCM = async () => {
  await requestUserPermission();
  const token = await getFCMToken();

  if (token) {
    try {
      await submitFcmTokenToBackend(token);
    } catch (error) {
      console.warn("FCM 토큰 서버 등록 실패:", error);
    }
  }

  subscribeFcmTokenRefresh();
};
