import { apiDelete, apiGet, apiPost } from "../core/client";

export type AccountDto = {
  nick_name: string;
  email?: string;
  profile_image?: string | null;
  user_role?: string;
};

/** 앱에서 쓰는 계정 정보 — 닉네임만 사용 */
export type AccountInfo = {
  nickName: string;
};

export type ChangeNicknameRequest = {
  nick_name: string;
};

export const mapAccountDto = (dto: AccountDto): AccountInfo => ({
  nickName: dto.nick_name?.trim() || "",
});

/**
 * 회원 정보 조회
 * GET /account
 */
export const getAccount = async (): Promise<AccountInfo> => {
  const response = await apiGet<AccountDto>("/account");
  return mapAccountDto(response);
};

/**
 * 닉네임 변경
 * POST /account/change/nickname
 */
export const changeNickname = async (nickName: string): Promise<string> => {
  const trimmed = nickName.trim();
  await apiPost<unknown>("/account/change/nickname", {
    nick_name: trimmed,
  } satisfies ChangeNicknameRequest);
  return trimmed;
};

/**
 * 회원 탈퇴
 * DELETE /account
 */
export const deleteAccount = async (): Promise<void> => {
  await apiDelete("/account");
};
