import { login as kakaoLogin } from "@react-native-seoul/kakao-login";

export const getKakaoAccessToken = async () => {
  const token = await kakaoLogin();
  if (!token.accessToken) {
    throw new Error("ACCESS_TOKEN_MISSING");
  }

  return token.accessToken;
};
