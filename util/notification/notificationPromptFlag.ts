import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_PROMPTED_KEY = "notification-push-consent-asked";
const PENDING_PUSH_CONSENT_KEY = "pending-push-consent";

export const hasPromptedNotificationPermission = async () => {
  const value = await AsyncStorage.getItem(NOTIFICATION_PROMPTED_KEY);
  return value === "true";
};

export const setNotificationPermissionPrompted = async () => {
  await AsyncStorage.setItem(NOTIFICATION_PROMPTED_KEY, "true");
};

export const getPendingPushConsent = async (): Promise<boolean | null> => {
  const value = await AsyncStorage.getItem(PENDING_PUSH_CONSENT_KEY);
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

export const setPendingPushConsent = async (isPushAgreed: boolean) => {
  await AsyncStorage.setItem(
    PENDING_PUSH_CONSENT_KEY,
    isPushAgreed ? "true" : "false",
  );
};

export const clearPendingPushConsent = async () => {
  await AsyncStorage.removeItem(PENDING_PUSH_CONSENT_KEY);
};
