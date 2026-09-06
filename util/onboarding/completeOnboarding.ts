import type { TermsApiKey } from "@/constants/termsData";
import type { OnboardingDraft } from "@/store/useOnboardingStore";
import type { Pet } from "@/store/usePetStore";
import { queryKeys } from "@/util/api/core/queryKeys";
import {
  submitTermsAgreement,
  type TermsAgreementState,
} from "@/util/api/terms/api";
import { setOnboardingComplete } from "@/util/onboarding/onboardingFlag";
import { submitOnboardingPet } from "@/util/onboarding/submitOnboardingPet";
import type { QueryClient } from "@tanstack/react-query";

type CompleteOnboardingParams = Pick<
  OnboardingDraft,
  | "name"
  | "profileImage"
  | "gender"
  | "birthDate"
  | "breedCode"
  | "color"
  | "isNeutered"
  | "weight"
  | "allergies"
  | "vaccines"
> & {
  agreements: TermsAgreementState;
  termVersions?: Partial<Record<TermsApiKey, string>>;
  queryClient: QueryClient;
  setPetList: (petList: Pet[] | null, totalPetCount?: number) => void;
  resetOnboarding: () => void;
};

export const completeOnboarding = async ({
  name,
  profileImage,
  gender,
  birthDate,
  breedCode,
  color,
  isNeutered,
  weight,
  allergies,
  vaccines,
  agreements,
  termVersions,
  queryClient,
  setPetList,
  resetOnboarding,
}: CompleteOnboardingParams) => {
  if (!gender) {
    throw new Error("기본 정보가 누락되었습니다. 이전 단계를 확인해주세요.");
  }

  await submitTermsAgreement(agreements, termVersions);

  const { list } = await submitOnboardingPet({
    name,
    profileImage,
    gender,
    birthDate,
    breedCode,
    color,
    isNeutered,
    weight,
    allergies,
    vaccines,
  });

  setPetList(list.items, list.totalCount);
  queryClient.setQueryData(queryKeys.pets.list(), list);
  await queryClient.invalidateQueries({ queryKey: queryKeys.pets.list() });
  await queryClient.invalidateQueries({ queryKey: queryKeys.terms.all });

  resetOnboarding();
  await setOnboardingComplete();

  return { name: name.trim(), list };
};
