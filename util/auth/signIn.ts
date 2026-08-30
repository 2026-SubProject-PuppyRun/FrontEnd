import { setTokens } from "@/util/api/core/authToken";
import { signInWithSocialProvider } from "./api";
import { getGoogleAccessToken } from "./providers/google";
import { getKakaoAccessToken } from "./providers/kakao";
import type { OAuthProvider, SocialSignInResponse } from "./types";

const providerAccessTokenGetters: Record<
  OAuthProvider,
  () => Promise<string>
> = {
  google: getGoogleAccessToken,
  kakao: getKakaoAccessToken,
};

/** 소셜 SDK 로그인 → 백엔드 토큰 교환 → access token 저장 */
export const signInWithOAuth = async (
  provider: OAuthProvider,
): Promise<SocialSignInResponse> => {
  const providerAccessToken = await providerAccessTokenGetters[provider]();
  const tokens = await signInWithSocialProvider(provider, providerAccessToken);

  setTokens(tokens.access_token, tokens.refresh_token);
  return tokens;
};
