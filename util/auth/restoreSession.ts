import {
  useAuthTokenStore,
  waitForAuthHydration,
} from "@/store/useAuthTokenStore";
import { refreshAccessToken } from "@/util/api/auth/refreshAccessToken";

/** 저장된 토큰으로 자동 로그인 가능한지 확인 */
export const restoreAuthSession = async (): Promise<boolean> => {
  await waitForAuthHydration();

  const { accessToken, refreshToken } = useAuthTokenStore.getState();

  if (accessToken) {
    return true;
  }

  if (!refreshToken) {
    return false;
  }

  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
};
