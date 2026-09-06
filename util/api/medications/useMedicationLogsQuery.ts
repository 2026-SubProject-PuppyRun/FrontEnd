import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getMedicationLogs } from "./api";

export const useMedicationLogsQuery = (petId?: string) =>
  useQuery({
    queryKey: queryKeys.medications.list(petId ?? ""),
    queryFn: () => getMedicationLogs(petId!),
    enabled: Boolean(petId),
    staleTime: 0,
    refetchOnMount: "always",
  });
