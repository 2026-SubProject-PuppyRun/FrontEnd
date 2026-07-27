import { delay } from "./delay";

type FetchWithRetryOptions = {
  maxAttempts?: number;
  retryDelayMs?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 600;

/** 네트워크 cold start / 일시 실패 대비 fetch 재시도 */
export const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchWithRetryOptions = {},
): Promise<Response> => {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(input, init);
      if (response.ok) return response;

      lastError = new Error(`HTTP ${response.status}`);
      console.warn(
        `fetch 실패 (${attempt}/${maxAttempts}): HTTP ${response.status}`,
      );
    } catch (error) {
      lastError = error;
      console.warn(
        `fetch 실패 (${attempt}/${maxAttempts}):`,
        error instanceof Error ? error.message : error,
      );
    }

    if (attempt < maxAttempts) {
      await delay(retryDelayMs * attempt);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("네트워크 요청에 실패했습니다.");
};
