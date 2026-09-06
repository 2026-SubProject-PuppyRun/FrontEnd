import { ApiError, ApiErrorBody, getApiErrorMessage } from "../core/errors";

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

const buildUrl = (path: string) => {
  const base = (process.env.EXPO_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

/** Refresh-Token 헤더로 access/refresh 토큰 재발급 (apiClient 미사용 — 순환 참조 방지) */
export const refreshAuthTokens = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Refresh-Token": refreshToken },
  });

  const contentType = response.headers.get("Content-Type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorBody = isJson ? (data as ApiErrorBody) : null;
    throw new ApiError(
      response.status,
      getApiErrorMessage(errorBody, `HTTP ${response.status}`),
      errorBody,
    );
  }

  return data as RefreshTokenResponse;
};
