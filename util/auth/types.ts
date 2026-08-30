export type OAuthProvider = "google" | "kakao";

export type SocialSignInRequest = {
  provider_access_token: string;
};

export type SocialSignInResponse = {
  access_token: string;
  refresh_token: string;
};
