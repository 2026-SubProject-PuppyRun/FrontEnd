import { refreshAuthTokens } from "./api";
import {
  clearTokens,
  getRefreshToken,
  setTokens,
} from "../core/authToken";
import { ApiError } from "../core/errors";

let refreshPromise: Promise<string> | null = null;

/** 동시 401 요청이 있어도 refresh는 한 번만 수행 */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, "리프레시 토큰이 없습니다.");
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const tokens = await refreshAuthTokens(refreshToken);
        setTokens(tokens.access_token, tokens.refresh_token);
        return tokens.access_token;
      } catch (error) {
        clearTokens();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};
