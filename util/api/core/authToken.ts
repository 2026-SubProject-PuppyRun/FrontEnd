/**
 * API 인증 토큰
 *
 * - 로그인/토큰 저장: 다른 팀원 작업 중 → `setAccessToken`은 추후 연동
 * - 당분간 `.env`의 `EXPO_PUBLIC_TEM_ADMIN_KEY`를 Bearer 토큰으로 사용
 */
let accessToken: string | null = null;

const getTempAdminToken = () =>
  process.env.EXPO_PUBLIC_TEM_ADMIN_KEY?.trim() || null;

/** 런타임 토큰 우선, 없으면 env 임시 토큰 */
export const getAccessToken = () => accessToken ?? getTempAdminToken();

/** 로그인 연동 후 발급받은 토큰 저장 (임시 env 토큰보다 우선) */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

/** 런타임 토큰만 제거 — env 임시 토큰은 그대로 사용됨 */
export const clearAccessToken = () => {
  accessToken = null;
};

/** env 임시 토큰으로 요청 중인지 (디버깅용) */
export const isUsingTempAdminToken = () =>
  accessToken === null && getTempAdminToken() !== null;
