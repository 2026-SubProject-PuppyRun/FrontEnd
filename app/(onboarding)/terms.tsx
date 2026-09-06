import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import TermsAgreementList from "@/components/onboarding/TermsAgreementList";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/ui/icon";
import {
  REQUIRED_TERMS_IDS,
  TERMS_AGREEMENT_ITEMS,
  type TermsAgreementId,
  type TermsApiKey,
} from "@/constants/termsData";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { usePetStore } from "@/store/usePetStore";
import { ApiError } from "@/util/api";
import { queryKeys } from "@/util/api/core/queryKeys";
import {
  getTermsStatus,
  submitTermsAgreement,
} from "@/util/api/terms/api";
import { isOnboardingComplete } from "@/util/onboarding/onboardingFlag";
import { completeOnboarding } from "@/util/onboarding/completeOnboarding";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

const createInitialAgreementState = () =>
  TERMS_AGREEMENT_ITEMS.reduce(
    (acc, item) => {
      acc[item.id] = false;
      return acc;
    },
    {} as Record<TermsAgreementId, boolean>,
  );

const Terms = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(createInitialAgreementState);

  const name = useOnboardingStore((s) => s.name);
  const profileImage = useOnboardingStore((s) => s.profileImage);
  const gender = useOnboardingStore((s) => s.gender);
  const birthDate = useOnboardingStore((s) => s.birthDate);
  const breedCode = useOnboardingStore((s) => s.breedCode);
  const color = useOnboardingStore((s) => s.color);
  const isNeutered = useOnboardingStore((s) => s.isNeutered);
  const weight = useOnboardingStore((s) => s.weight);
  const allergies = useOnboardingStore((s) => s.allergies);
  const vaccines = useOnboardingStore((s) => s.vaccines);
  const reset = useOnboardingStore((s) => s.reset);

  const setPetList = usePetStore((s) => s.setPetList);
  const petList = usePetStore((s) => s.petList);

  const { data: termsStatus } = useQuery({
    queryKey: queryKeys.terms.status(),
    queryFn: getTermsStatus,
    staleTime: 0,
  });

  const termVersions = useMemo(() => {
    const versions: Partial<Record<TermsApiKey, string>> = {
      ...termsStatus?.versions,
    };
    return versions;
  }, [termsStatus?.versions]);

  useEffect(() => {
    if (!termsStatus?.terms.length) return;

    setAgreed((prev) => {
      const next = { ...prev };
      for (const term of termsStatus.terms) {
        // 최신 버전에 이미 동의한 항목만 체크 유지
        next[term.id] = term.agreed;
      }
      return next;
    });
  }, [termsStatus]);

  const requiredAgreed = useMemo(
    () => REQUIRED_TERMS_IDS.every((id) => agreed[id]),
    [agreed],
  );

  const handleChange = (id: TermsAgreementId, value: boolean) => {
    setAgreed((prev) => ({ ...prev, [id]: value }));
  };

  const handleAgreeAll = (value: boolean) => {
    setAgreed(
      TERMS_AGREEMENT_ITEMS.reduce(
        (acc, item) => {
          acc[item.id] = value;
          return acc;
        },
        {} as Record<TermsAgreementId, boolean>,
      ),
    );
  };

  const shouldRegisterPet = async () => {
    if (gender && name.trim() && breedCode && weight) {
      return true;
    }
    if (await isOnboardingComplete()) {
      return false;
    }
    return (petList?.length ?? 0) === 0 && Boolean(gender);
  };

  const handleComplete = async () => {
    if (isSubmitting) return;

    if (!requiredAgreed) {
      showToast({
        message: "필수 약관에 모두 동의해주세요.",
        icon: AlertCircleIcon,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const registerPet = await shouldRegisterPet();

      if (registerPet) {
        const result = await completeOnboarding({
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
          agreements: agreed,
          termVersions,
          queryClient,
          setPetList,
          resetOnboarding: reset,
        });

        showToast({
          message: `${result.name} 등록이 완료됐어요!`,
          icon: CheckCircleIcon,
        });
      } else {
        await submitTermsAgreement(agreed, termVersions);
        await queryClient.invalidateQueries({ queryKey: queryKeys.terms.all });
        showToast({
          message: "약관 동의가 완료됐어요!",
          icon: CheckCircleIcon,
        });
      }

      router.replace("/(tabs)/home");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.status === 409
            ? "약관 버전이 변경되었어요. 다시 시도해 주세요."
            : error.status === 400
              ? error.message || "필수 약관에 모두 동의해주세요."
              : error.message || "약관 동의에 실패했어요."
          : error instanceof Error
            ? error.message
            : "약관 동의에 실패했어요. 잠시 후 다시 시도해 주세요.";
      showToast({
        message,
        icon: AlertCircleIcon,
      });

      if (error instanceof ApiError && error.status === 409) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.terms.all });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingScreen
      step={4}
      title={"약관에\n동의해주세요"}
      subtitle="퍼피런 이용을 위해 아래 약관 동의가 필요해요"
      ctaLabel="시작하기"
      ctaLoading={isSubmitting}
      ctaDisabled={!requiredAgreed}
      onCtaPress={handleComplete}
      showBack={Boolean(gender && name.trim())}
    >
      <TermsAgreementList
        agreed={agreed}
        onChange={handleChange}
        onAgreeAll={handleAgreeAll}
      />
    </OnboardingScreen>
  );
};

export default Terms;
