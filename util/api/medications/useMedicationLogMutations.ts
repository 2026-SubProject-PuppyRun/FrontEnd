import type { MedicationFormValues } from "@/types/medication";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  createMedicationLog,
  deleteMedicationLog,
  toMedicationLogRequest,
  updateMedicationLog,
} from "./api";

const listKey = (petId: string) => queryKeys.medications.list(petId);

export const useCreateMedicationLogMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: MedicationFormValues) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      return createMedicationLog(petId, toMedicationLogRequest(values));
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useUpdateMedicationLogMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationLogId,
      values,
    }: {
      medicationLogId: string;
      values: MedicationFormValues;
    }) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!medicationLogId) throw new Error("medicationLogId가 필요합니다.");
      return updateMedicationLog(
        petId,
        medicationLogId,
        toMedicationLogRequest(values, { fullUpdate: true }),
      );
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useDeleteMedicationLogMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationLogId: string) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!medicationLogId) throw new Error("medicationLogId가 필요합니다.");
      return deleteMedicationLog(petId, medicationLogId);
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};
