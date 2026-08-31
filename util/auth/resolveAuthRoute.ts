import { getPetList } from "@/util/api/pets/api";
import { isOnboardingComplete } from "@/util/onboarding/onboardingFlag";
import { restoreAuthSession } from "./restoreSession";

export type AppRoute = "auth" | "home" | "onboarding";

const shouldSkipOnboarding = async (): Promise<boolean> => {
  if (await isOnboardingComplete()) {
    return true;
  }

  try {
    const { totalCount, items } = await getPetList();
    return (totalCount ?? items.length) >= 1;
  } catch (error) {
    console.warn("반려견 목록 조회 실패, 온보딩으로 이동:", error);
    return false;
  }
};

/** 앱 진입 시 로그인·온보딩·홈 화면 결정 */
export const resolveAppRoute = async (): Promise<AppRoute> => {
  const isLoggedIn = await restoreAuthSession();
  if (!isLoggedIn) {
    return "auth";
  }

  return (await shouldSkipOnboarding()) ? "home" : "onboarding";
};

/** 로그인 직후 홈 또는 온보딩 결정 */
export const resolvePostLoginRoute = async (): Promise<
  "home" | "onboarding"
> => {
  return (await shouldSkipOnboarding()) ? "home" : "onboarding";
};
