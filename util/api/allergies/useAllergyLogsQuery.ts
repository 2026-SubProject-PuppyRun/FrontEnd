import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getAllergies } from "./api";

export const useAllergyLogsQuery = (petId?: string) =>
  useQuery({
    queryKey: queryKeys.allergies.list(petId ?? ""),
    queryFn: () => getAllergies(petId ?? ""),
    enabled: Boolean(petId),
    staleTime: 0,
    refetchOnMount: "always",
  });
