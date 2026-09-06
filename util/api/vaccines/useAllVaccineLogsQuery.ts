import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryKeys } from "../core/queryKeys";
import { getVaccinations } from "./api";

export const useAllVaccineLogsQuery = (petIds: string[]) => {
  const queries = useQueries({
    queries: petIds.map((petId) => ({
      queryKey: queryKeys.vaccines.list(petId),
      queryFn: () => getVaccinations(petId),
      enabled: Boolean(petId),
      staleTime: 0,
      refetchOnMount: "always" as const,
    })),
  });

  const records = useMemo(
    () => queries.flatMap((query) => query.data?.records ?? []),
    [queries],
  );

  return {
    records,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
  };
};
