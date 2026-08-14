import { apiPost } from "../core/client";

export type RegisterNotificationConsentRequest = {
  is_push_agreed: boolean;
  fcm_token: string;
};

export type RegisterFcmTokenRequest = {
  fcm_token: string;
};

/**
 * 알림 수신 동의 최초 등록
 * POST /notifications/agree
 * - 알림 설정이 없는 계정에서 한 번만 성공
 * - 재등록 시 409 Conflict
 */
export const registerNotificationConsent = (
  isPushAgreed: boolean,
  fcmToken: string,
) =>
  apiPost<void>("/notifications/agree", {
    is_push_agreed: isPushAgreed,
    fcm_token: fcmToken,
  } satisfies RegisterNotificationConsentRequest);

/**
 * FCM 기기 토큰 등록/교체
 * POST /notifications/fcm-token
 * - 알림 설정이 이미 존재하는 계정에서만 사용
 * - 동일 토큰 재등록도 성공 (idempotent)
 */
export const registerFcmToken = (fcmToken: string) =>
  apiPost<void>("/notifications/fcm-token", {
    fcm_token: fcmToken,
  } satisfies RegisterFcmTokenRequest);
