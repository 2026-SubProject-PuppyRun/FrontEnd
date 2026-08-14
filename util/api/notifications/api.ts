import { apiPost } from "../core/client";

export type RegisterFcmTokenRequest = {
  fcm_token: string;
};

/**
 * FCM 기기 토큰 등록/교체
 * POST /notifications/fcm-token
 * - 동일 토큰 재등록도 성공 (idempotent)
 */
export const registerFcmToken = (fcmToken: string) =>
  apiPost<void>("/notifications/fcm-token", {
    fcm_token: fcmToken,
  } satisfies RegisterFcmTokenRequest);
