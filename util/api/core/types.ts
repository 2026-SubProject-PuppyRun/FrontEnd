/** 페이지네이션 응답 예시 — 백엔드 스펙에 맞게 조정 */
export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page?: number;
  pageSize?: number;
};

/** apiClient 옵션 */
export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** JSON body — 객체를 넘기면 자동 직렬화 */
  json?: unknown;
  /** multipart FormData — 설정 시 Content-Type을 자동 boundary에 맡김 */
  formData?: FormData;
  /** true면 Authorization 헤더 생략 (로그인 등) */
  skipAuth?: boolean;
  /** fetchWithRetry 재시도 횟수 (기본 1 = 재시도 없음) */
  retry?: number;
};
