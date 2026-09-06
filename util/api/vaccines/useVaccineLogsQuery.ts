import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getVaccinations } from "./api";

export const useVaccineLogsQuery = (petId?: string) =>
  useQuery({
    queryKey: queryKeys.vaccines.list(petId ?? ""),
    queryFn: () => getVaccinations(petId ?? ""),
    enabled: Boolean(petId),
    staleTime: 0,
    refetchOnMount: "always",
  });
