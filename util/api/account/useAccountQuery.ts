import { useUserStore } from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeys } from "../core/queryKeys";
import { getAccount } from "./api";

type UseAccountQueryOptions = {
  enabled?: boolean;
};

/**
 * 회원 정보 조회
 * GET /account
 */
export const useAccountQuery = ({
  enabled = true,
}: UseAccountQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.account.me(),
    queryFn: getAccount,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

/** 쿼리 성공 시 user store와 동기화 */
export const useSyncAccountFromQuery = (enabled = true) => {
  const setNickName = useUserStore((state) => state.setNickName);
  const query = useAccountQuery({ enabled });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setNickName(query.data.nickName);
    }
  }, [query.isSuccess, query.data, setNickName]);

  useEffect(() => {
    if (query.isError) {
      console.warn("회원 정보 조회 실패:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
