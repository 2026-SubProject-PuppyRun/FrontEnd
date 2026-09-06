import {
  TERMS_AGREEMENT_ITEMS,
  TERMS_ID_BY_API_KEY,
  TERMS_VERSION,
  type TermsAgreementId,
  type TermsApiKey,
} from "@/constants/termsData";
import { apiGet, apiPost } from "../core/client";

export type TermsAgreementState = Record<TermsAgreementId, boolean>;

export type TermsAgreementPayload = {
  agreed: boolean;
  version: string;
};

export type SubmitTermsAgreementRequest = Record<
  TermsApiKey,
  TermsAgreementPayload
>;

export type TermsStatusItemDto = {
  type: TermsApiKey;
  required: boolean;
  agreed: boolean;
  version: string;
};

export type TermsStatusDto = {
  agreement_required: boolean;
  terms: TermsStatusItemDto[];
};

export type TermsStatus = {
  agreementRequired: boolean;
  terms: {
    id: TermsAgreementId;
    apiKey: TermsApiKey;
    required: boolean;
    agreed: boolean;
    version: string;
  }[];
  /** type → 서버에 등록된 최신 버전 */
  versions: Partial<Record<TermsApiKey, string>>;
};

export const mapTermsStatus = (dto: TermsStatusDto): TermsStatus => {
  const versions: Partial<Record<TermsApiKey, string>> = {};
  const terms = (dto.terms ?? []).flatMap((item) => {
    const id = TERMS_ID_BY_API_KEY[item.type];
    if (!id) return [];
    versions[item.type] = item.version || TERMS_VERSION;
    return [
      {
        id,
        apiKey: item.type,
        required: item.required,
        agreed: item.agreed,
        version: item.version || TERMS_VERSION,
      },
    ];
  });

  return {
    agreementRequired: dto.agreement_required,
    terms,
    versions,
  };
};

export const toTermsAgreementRequest = (
  agreed: TermsAgreementState,
  versions?: Partial<Record<TermsApiKey, string>>,
): SubmitTermsAgreementRequest =>
  TERMS_AGREEMENT_ITEMS.reduce((acc, item) => {
    acc[item.apiKey] = {
      agreed: agreed[item.id],
      version: versions?.[item.apiKey] ?? TERMS_VERSION,
    };
    return acc;
  }, {} as SubmitTermsAgreementRequest);

/**
 * 약관 동의 상태 조회
 * GET /terms/status
 */
export const getTermsStatus = async (): Promise<TermsStatus> => {
  const response = await apiGet<TermsStatusDto>("/terms/status");
  return mapTermsStatus(response);
};

/**
 * 약관 동의 등록
 * POST /terms/agreements
 */
export const submitTermsAgreement = (
  agreed: TermsAgreementState,
  versions?: Partial<Record<TermsApiKey, string>>,
) =>
  apiPost<void>(
    "/terms/agreements",
    toTermsAgreementRequest(agreed, versions) satisfies SubmitTermsAgreementRequest,
  );
