/** 백엔드 에러 응답 공통 형태 (스펙에 맞게 수정) */
export type ApiErrorBody = {
  message?: string;
  description?: string;
  code?: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(
    status: number,
    message: string,
    body: ApiErrorBody | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

/** message가 비어 있으면 description 사용 */
export const getApiErrorMessage = (
  body: ApiErrorBody | null | undefined,
  fallback: string,
) => {
  const message = body?.message?.trim();
  if (message) return message;
  const description = body?.description?.trim();
  if (description) return description;
  return fallback;
};
