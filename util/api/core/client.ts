import { delay } from "@/util/location/delay";
import { refreshAccessToken } from "../auth/refreshAccessToken";
import { clearTokens, getAccessToken } from "./authToken";
import { ApiError, ApiErrorBody, getApiErrorMessage } from "./errors";
import type { ApiRequestOptions } from "./types";

const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL ?? "";

const isRefreshEndpoint = (path: string) => path.includes("/auth/refresh");

const buildUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = DEFAULT_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

const buildHeaders = (
  initHeaders: HeadersInit | undefined,
  jsonBody: unknown,
  skipAuth: boolean,
  isFormData: boolean,
): Headers => {
  const headers = new Headers(initHeaders);

  // FormData는 boundary 포함 Content-Type을 fetch가 자동 설정
  if (!isFormData && jsonBody !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
};

/** 네트워크 실패만 재시도 (4xx/5xx는 그대로 반환해 ApiError로 변환) */
const fetchWithNetworkRetry = async (
  url: string,
  init: RequestInit,
  maxAttempts: number,
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await delay(600 * attempt);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("네트워크 요청에 실패했습니다.");
};

/**
 * 모든 API 요청의 진입점.
 * - base URL: EXPO_PUBLIC_BASE_URL
 * - Authorization: 저장된 access token (Bearer)
 * - JSON 직렬화 또는 multipart FormData
 * - 4xx/5xx → ApiError throw
 */
export async function apiClient<T>(
  path: string,
  options: ApiRequestOptions = {},
  authRetried = false,
): Promise<T> {
  const { json, formData, skipAuth = false, retry = 1, ...init } = options;

  if (!DEFAULT_BASE_URL && !path.startsWith("http")) {
    throw new ApiError(
      0,
      "EXPO_PUBLIC_BASE_URL이 설정되지 않았습니다. .env를 확인해 주세요.",
    );
  }

  const url = buildUrl(path);
  const isFormData = formData != null;
  const headers = buildHeaders(init.headers, json, skipAuth, isFormData);
  const body = isFormData
    ? formData
    : json !== undefined
      ? JSON.stringify(json)
      : undefined;

  const response = await fetchWithNetworkRetry(
    url,
    { ...init, headers, body },
    retry,
  );

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (
      response.status === 401 &&
      !skipAuth &&
      !authRetried &&
      !isRefreshEndpoint(path)
    ) {
      try {
        await refreshAccessToken();
        return apiClient<T>(path, options, true);
      } catch (refreshError) {
        clearTokens();
        if (refreshError instanceof ApiError) {
          throw refreshError;
        }
      }
    }

    const errorBody = isJson ? (data as ApiErrorBody) : null;
    const fallback =
      typeof data === "string" && data.length > 0
        ? data
        : `HTTP ${response.status}`;
    const message = getApiErrorMessage(errorBody, fallback);

    throw new ApiError(response.status, message, errorBody);
  }

  return data as T;
}

/** GET shorthand */
export const apiGet = <T>(path: string, options?: ApiRequestOptions) =>
  apiClient<T>(path, { ...options, method: "GET" });

/** POST shorthand */
export const apiPost = <T>(
  path: string,
  json?: unknown,
  options?: ApiRequestOptions,
) => apiClient<T>(path, { ...options, method: "POST", json });

/** PATCH shorthand */
export const apiPatch = <T>(
  path: string,
  json?: unknown,
  options?: ApiRequestOptions,
) => apiClient<T>(path, { ...options, method: "PATCH", json });

/** PUT shorthand */
export const apiPut = <T>(
  path: string,
  json?: unknown,
  options?: ApiRequestOptions,
) => apiClient<T>(path, { ...options, method: "PUT", json });

/** DELETE shorthand */
export const apiDelete = <T>(path: string, options?: ApiRequestOptions) =>
  apiClient<T>(path, { ...options, method: "DELETE" });

/** multipart/form-data POST */
export const apiPostForm = <T>(
  path: string,
  formData: FormData,
  options?: ApiRequestOptions,
) => apiClient<T>(path, { ...options, method: "POST", formData });

/** multipart/form-data PUT */
export const apiPutForm = <T>(
  path: string,
  formData: FormData,
  options?: ApiRequestOptions,
) => apiClient<T>(path, { ...options, method: "PUT", formData });
