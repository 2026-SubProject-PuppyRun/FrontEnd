import { useAuthTokenStore } from "@/store/useAuthTokenStore";

export const getAccessToken = () => useAuthTokenStore.getState().accessToken;

export const getRefreshToken = () => useAuthTokenStore.getState().refreshToken;

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

export const isAuthenticated = () =>
  Boolean(useAuthTokenStore.getState().accessToken);
