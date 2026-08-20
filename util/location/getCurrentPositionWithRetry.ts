import * as Location from "expo-location";
import { delay } from "./delay";

type GetCurrentPositionOptions = {
  maxAttempts?: number;
  /** 첫 시도 전 대기 (앱/GPS cold start 대비) */
  initialDelayMs?: number;
  /** 재시도 사이 기본 대기 */
  retryDelayMs?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY_MS = 400;
const DEFAULT_RETRY_DELAY_MS = 800;

/** GPS cold start 대비 재시도. High 실패 시 Balanced로 한 번 더 시도 */
export const getCurrentPositionWithRetry = async (
  options: GetCurrentPositionOptions = {},
): Promise<Location.LocationObject> => {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const initialDelayMs = options.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  if (initialDelayMs > 0) {
    await delay(initialDelayMs);
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const accuracy =
      attempt === maxAttempts
        ? Location.Accuracy.Balanced
        : Location.Accuracy.High;

    try {
      return await Location.getCurrentPositionAsync({ accuracy });
    } catch (error) {
      lastError = error;
      console.warn(
        `위치 조회 실패 (${attempt}/${maxAttempts}):`,
        error instanceof Error ? error.message : error,
      );

      if (attempt < maxAttempts) {
        await delay(retryDelayMs * attempt);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("현재 위치를 가져올 수 없습니다.");
};
