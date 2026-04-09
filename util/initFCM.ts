import { getFCMToken, requestUserPermission } from "./firebaseMessage";

export const initFCM = async () => {
  await requestUserPermission();
  await getFCMToken();
};
