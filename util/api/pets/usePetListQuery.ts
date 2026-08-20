import { usePetStore } from "@/store/usePetStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeys } from "../core/queryKeys";
import { getPetList } from "./api";

type UsePetListQueryOptions = {
  /** false면 fetch 안 함 (토큰 없을 때 등) */
  enabled?: boolean;
};

/**
 * 반려견 목록 조회 (React Query)
 */
export const usePetListQuery = ({
  enabled = true,
}: UsePetListQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.pets.list(),
    queryFn: getPetList,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

/** 쿼리 성공 시 Zustand pet store와 동기화 */
export const useSyncPetListFromQuery = (enabled = true) => {
  const setPetList = usePetStore((state) => state.setPetList);
  const query = usePetListQuery({ enabled });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setPetList(query.data.items, query.data.totalCount);
    }
  }, [query.isSuccess, query.data, setPetList]);

  useEffect(() => {
    if (query.isError) {
      console.warn("반려견 목록 조회 실패:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
