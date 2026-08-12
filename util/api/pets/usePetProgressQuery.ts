import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getPetProgress } from "./api";

type UsePetProgressQueryOptions = {
  petIds?: string[];
  enabled?: boolean;
};

/** 반려견 산책 진행도 조회 */
export const usePetProgressQuery = ({
  petIds,
  enabled = true,
}: UsePetProgressQueryOptions = {}) =>
  useQuery({
    queryKey: queryKeys.pets.progress(petIds),
    queryFn: () => getPetProgress(petIds),
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
