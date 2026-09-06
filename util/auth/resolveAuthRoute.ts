import { getPetList } from "@/util/api/pets/api";
import { getTermsStatus } from "@/util/api/terms/api";
import { isOnboardingComplete } from "@/util/onboarding/onboardingFlag";
import { restoreAuthSession } from "./restoreSession";

export type AppRoute = "auth" | "home" | "onboarding" | "terms";

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

/** 필수 약관 재동의 필요 여부 */
const isTermsAgreementRequired = async (): Promise<boolean> => {
  try {
    const status = await getTermsStatus();
    return status.agreementRequired;
  } catch (error) {
    console.warn("약관 동의 상태 조회 실패:", error);
    return false;
  }
};

/**
 * 앱 진입 시 로그인·온보딩·약관·홈 화면 결정
 * - 신규 유저: 온보딩(마지막에 약관)
 * - 기존 유저 + 약관 미동의/버전 변경: 약관만
 */
export const resolveAppRoute = async (): Promise<AppRoute> => {
  const isLoggedIn = await restoreAuthSession();
  if (!isLoggedIn) {
    return "auth";
  }

  if (!(await shouldSkipOnboarding())) {
    return "onboarding";
  }

  if (await isTermsAgreementRequired()) {
    return "terms";
  }

  return "home";
};

/** 로그인 직후 홈·온보딩·약관 결정 */
export const resolvePostLoginRoute = async (): Promise<
  "home" | "onboarding" | "terms"
> => {
  if (!(await shouldSkipOnboarding())) {
    return "onboarding";
  }

  if (await isTermsAgreementRequired()) {
    return "terms";
  }

  return "home";
};
