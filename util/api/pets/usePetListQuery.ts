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
 * React Query + pets API 사용 예시.
 *
 * @example
 * const { data, isLoading, error, refetch } = usePetListQuery();
 *
 * // app/_layout.tsx 등에서:
 * useEffect(() => {
 *   if (data?.items) setPetList(data.items, data.totalCount);
 * }, [data]);
 */
export const usePetListQuery = ({ enabled = true }: UsePetListQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.pets.list(),
    queryFn: getPetList,
    enabled,
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      items: response.items,
      totalCount: response.totalCount,
    }),
  });

/** 쿼리 성공 시 Zustand pet store와 동기화하는 헬퍼 예시 */
export const useSyncPetListFromQuery = (enabled = true) => {
  const setPetList = usePetStore((state) => state.setPetList);
  const query = usePetListQuery({ enabled });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setPetList(query.data.items, query.data.totalCount);
    }
  }, [query.isSuccess, query.data, setPetList]);

  return query;
};
