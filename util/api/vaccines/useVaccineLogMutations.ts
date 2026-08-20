import type { VaccineFormValues } from "@/types/vaccine";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { createVaccination, deleteVaccination, toVaccinationRequest, updateVaccination } from "./api";

const listKey = (petId: string) => queryKeys.vaccines.list(petId);

export const useCreateVaccinationMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: VaccineFormValues) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      return createVaccination(petId, toVaccinationRequest(values));
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useUpdateVaccinationMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vaccinationId,
      values,
    }: {
      vaccinationId: string;
      values: VaccineFormValues;
    }) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!vaccinationId) throw new Error("vaccinationId가 필요합니다.");
      return updateVaccination(
        petId,
        vaccinationId,
        toVaccinationRequest(values),
      );
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useDeleteVaccinationMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vaccinationId: string) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!vaccinationId) throw new Error("vaccinationId가 필요합니다.");
      return deleteVaccination(petId, vaccinationId);
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};
