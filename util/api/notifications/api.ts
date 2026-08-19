import { apiGet, apiPatch, apiPost } from "../core/client";
import type { NotificationOptionCode } from "@/constants/notificationOptions";

export type RegisterNotificationConsentRequest = {
  is_push_agreed: boolean;
  fcm_token: string;
};

export type RegisterFcmTokenRequest = {
  fcm_token: string;
};

export type NotificationOptionDto = {
  option_code: NotificationOptionCode;
  enabled: boolean;
};

export type NotificationOptionGroupDto = {
  prefix: string;
  options: NotificationOptionDto[];
};

export type NotificationSettingsDto = {
  is_push_agreed: boolean;
  notification_options: NotificationOptionGroupDto[];
};

export type NotificationSettings = {
  isPushAgreed: boolean;
  options: {
    optionCode: NotificationOptionCode;
    enabled: boolean;
  }[];
};

export const mapNotificationSettings = (
  dto: NotificationSettingsDto,
): NotificationSettings => ({
  isPushAgreed: dto.is_push_agreed,
  options: (dto.notification_options ?? []).flatMap((group) =>
    (group.options ?? []).map((option) => ({
      optionCode: option.option_code,
      enabled: option.enabled,
    })),
  ),
});

/**
 * 알림 수신 동의 최초 등록
 * POST /notifications/agree
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
 */
export const registerFcmToken = (fcmToken: string) =>
  apiPost<void>("/notifications/fcm-token", {
    fcm_token: fcmToken,
  } satisfies RegisterFcmTokenRequest);

/**
 * 알림 설정 조회
 * GET /notifications
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiGet<NotificationSettingsDto>("/notifications");
  return mapNotificationSettings(response);
};

/**
 * 전체 푸시 수신 동의 변경
 * PATCH /notifications/options/global
 */
export const updatePushAgreement = (isPushAgreed: boolean) =>
  apiPatch<void>("/notifications/options/global", {
    is_push_agreed: isPushAgreed,
  });

/**
 * 알림 유형별 수신 여부 변경
 * PATCH /notifications/options
 */
export const updateNotificationOption = (
  optionCode: NotificationOptionCode,
  enabled: boolean,
) =>
  apiPatch<void>("/notifications/options", {
    option_code: optionCode,
    enabled,
  });
