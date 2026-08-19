import { subscribeFcmTokenRefresh } from "./firebaseMessage";

/** 앱 시작 시 FCM 리스너만 준비 (토큰 최초 등록은 푸시 허용 시) */
export const initFCM = async () => {
  subscribeFcmTokenRefresh();
};
