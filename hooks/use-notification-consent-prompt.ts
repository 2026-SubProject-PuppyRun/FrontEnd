import {
  beginSystemPermissionPrompt,
  endSystemPermissionPrompt,
  openPermissionModal,
} from "@/store/usePermissionModalStore";
import {
  flushPendingPushConsent,
  hasPromptedNotificationPermission,
  registerPushConsent,
  requestUserPermission,
  setNotificationPermissionPrompted,
} from "@/util/notification";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const handleAllow = async () => {
  await setNotificationPermissionPrompted();
  try {
    const enabled = await requestUserPermission();
    try {
      await registerPushConsent(enabled);
    } catch (error) {
      console.warn("알림 동의 등록 실패:", error);
    }
  } finally {
    endSystemPermissionPrompt();
  }
};

const handleDeny = async () => {
  await setNotificationPermissionPrompted();
  try {
    await registerPushConsent(false);
  } catch (error) {
    console.warn("알림 거절 등록 실패:", error);
  }
};

/** 로그인·온보딩 이후 홈에 처음 들어올 때 푸시 동의 팝업을 띄웁니다. */
export const useNotificationConsentPrompt = () => {
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const timer = setTimeout(() => {
        void (async () => {
          const alreadyPrompted = await hasPromptedNotificationPermission();
          if (cancelled) return;

          if (alreadyPrompted) {
            await flushPendingPushConsent();
            return;
          }

          openPermissionModal({
            kind: "notification",
            onConfirm: () => {
              // close() 전에 잠가서 시스템 알림 권한 팝업과 다음 모달이 겹치지 않게 함
              beginSystemPermissionPrompt();
              void handleAllow();
            },
            onCancel: () => {
              void handleDeny();
            },
          });
        })();
      }, 400);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }, []),
  );
};
