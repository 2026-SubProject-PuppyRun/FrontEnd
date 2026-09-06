import { apiPost } from "@/util/api/core/client";
import type {
  OAuthProvider,
  SocialSignInRequest,
  SocialSignInResponse,
} from "./types";

/** 소셜 제공자 access token으로 서비스 토큰 발급 */
export const signInWithSocialProvider = (
  provider: OAuthProvider,
  providerAccessToken: string,
) =>
  apiPost<SocialSignInResponse>(
    `/oauth2/${provider}/sign-in`,
    {
      provider_access_token: providerAccessToken,
    } satisfies SocialSignInRequest,
    { skipAuth: true },
  );
