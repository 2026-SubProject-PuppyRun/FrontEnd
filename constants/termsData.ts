export type TermsAgreementId = "service" | "privacy" | "location" | "marketing";

/** POST /terms/agreements 요청 키 */
export type TermsApiKey =
  | "service_terms"
  | "privacy_policy"
  | "location_information"
  | "marketing_agreement";

export type TermsAgreementItem = {
  id: TermsAgreementId;
  apiKey: TermsApiKey;
  label: string;
  required: boolean;
  url: string;
};

/** 약관 버전 — 백엔드 최신 버전과 맞춰야 함 */
export const TERMS_VERSION = "1.0";

const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL;
const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL;
const LOCATION_URL = process.env.EXPO_PUBLIC_LOCATION_URL;
const MARKETING_URL = process.env.EXPO_PUBLIC_MARKETING_URL;

export const TERMS_AGREEMENT_ITEMS: TermsAgreementItem[] = [
  {
    id: "service",
    apiKey: "service_terms",
    label: "서비스 이용약관",
    required: true,
    url: `${TERMS_URL}`,
  },
  {
    id: "privacy",
    apiKey: "privacy_policy",
    label: "개인정보 처리방침",
    required: true,
    url: `${PRIVACY_URL}`,
  },
  {
    id: "location",
    apiKey: "location_information",
    label: "위치정보 이용약관",
    required: true,
    url: `${LOCATION_URL}`,
  },
  {
    id: "marketing",
    apiKey: "marketing_agreement",
    label: "마케팅 정보 수신",
    required: false,
    url: `${MARKETING_URL}`,
  },
];

export const TERMS_ID_BY_API_KEY = TERMS_AGREEMENT_ITEMS.reduce(
  (acc, item) => {
    acc[item.apiKey] = item.id;
    return acc;
  },
  {} as Record<TermsApiKey, TermsAgreementId>,
);

export const REQUIRED_TERMS_IDS = TERMS_AGREEMENT_ITEMS.filter(
  (item) => item.required,
).map((item) => item.id);
