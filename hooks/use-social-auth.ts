import { ApiError } from "@/util/api";
import {
  configureGoogleSignIn,
  signInWithOAuth,
  type OAuthProvider,
} from "@/util/auth";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "구글",
  kakao: "카카오",
};

const getSocialAuthErrorMessage = (
  provider: OAuthProvider,
  error: unknown,
) => {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return error.message || "잘못된 요청입니다.";
    }
    if (error.status === 401) {
      return (
        error.message ||
        `${PROVIDER_LABELS[provider]} 액세스 토큰이 유효하지 않습니다.`
      );
    }
    return error.message || "알 수 없는 오류가 발생했습니다.";
  }

  return `${PROVIDER_LABELS[provider]} 로그인 중 오류가 발생했습니다.`;
};

export const useSocialAuth = () => {
  const router = useRouter();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = useCallback(
    async (provider: OAuthProvider) => {
      try {
        await signInWithOAuth(provider);
        router.replace("/(tabs)/home");
      } catch (error) {
        console.error(`${PROVIDER_LABELS[provider]} 로그인 실패:`, error);
        Alert.alert("로그인 실패", getSocialAuthErrorMessage(provider, error));
      }
    },
    [router],
  );

  return {
    signInWithGoogle: () => signIn("google"),
    signInWithKakao: () => signIn("kakao"),
  };
};
