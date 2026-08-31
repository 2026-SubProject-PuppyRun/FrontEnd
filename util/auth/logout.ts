import { useAuthTokenStore } from "@/store/useAuthTokenStore";
import { usePetStore } from "@/store/usePetStore";
import { useUserStore } from "@/store/useUserStore";
import { clearTokens } from "@/util/api/core/authToken";
import { clearOnboardingComplete } from "@/util/onboarding/onboardingFlag";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { logout as kakaoLogout } from "@react-native-seoul/kakao-login";

/** 토큰·로컬 저장소·세션 스토어 초기화 후 소셜 SDK 로그아웃 */
export const logout = async () => {
  clearTokens();
  await useAuthTokenStore.persist.clearStorage();
  await clearOnboardingComplete();

  useUserStore.getState().setNickName(null);
  usePetStore.getState().setPetList(null);

  await Promise.allSettled([GoogleSignin.signOut(), kakaoLogout()]);
};
