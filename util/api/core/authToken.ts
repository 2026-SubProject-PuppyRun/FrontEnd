import { useAuthTokenStore } from "@/store/useAuthTokenStore";

const getTempAdminToken = () =>
  process.env.EXPO_PUBLIC_TEM_ADMIN_KEY?.trim() || null;

/** 저장된 access token 우선, 없으면 env 임시 토큰 */
export const getAccessToken = () =>
  useAuthTokenStore.getState().accessToken ?? getTempAdminToken();

export const getRefreshToken = () =>
  useAuthTokenStore.getState().refreshToken;

export const setTokens = (accessToken: string, refreshToken: string) => {
  useAuthTokenStore.getState().setTokens({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};

/** access token만 갱신 (refresh token 유지) */
export const setAccessToken = (token: string | null) => {
  if (token === null) {
    clearTokens();
    return;
  }

  const refreshToken = getRefreshToken();
  if (refreshToken) {
    setTokens(token, refreshToken);
    return;
  }

  useAuthTokenStore.setState({ accessToken: token });
};

export const clearTokens = () => {
  useAuthTokenStore.getState().clearTokens();
};

/** @deprecated clearTokens 사용 */
export const clearAccessToken = clearTokens;

export const isAuthenticated = () => Boolean(useAuthTokenStore.getState().accessToken);

/** env 임시 토큰으로 요청 중인지 (디버깅용) */
export const isUsingTempAdminToken = () =>
  useAuthTokenStore.getState().accessToken === null &&
  getTempAdminToken() !== null;
