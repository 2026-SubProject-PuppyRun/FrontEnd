import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getWeightLogs } from "./api";

export const useWeightLogsQuery = (petId?: string) =>
  useQuery({
    queryKey: queryKeys.weights.list(petId ?? ""),
    queryFn: () => getWeightLogs(petId ?? ""),
    enabled: Boolean(petId),
    staleTime: 0,
    refetchOnMount: "always",
  });
