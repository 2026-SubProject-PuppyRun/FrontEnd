import type { AllergyFormValues } from "@/types/allergy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  createAllergy,
  deleteAllergy,
  toAllergyRequest,
  updateAllergy,
} from "./api";

const listKey = (petId: string) => queryKeys.allergies.list(petId);

export const useCreateAllergyMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AllergyFormValues) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      return createAllergy(petId, toAllergyRequest(values));
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useUpdateAllergyMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      allergyId,
      values,
    }: {
      allergyId: string;
      values: AllergyFormValues;
    }) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!allergyId) throw new Error("allergyId가 필요합니다.");
      return updateAllergy(petId, allergyId, toAllergyRequest(values));
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};

export const useDeleteAllergyMutation = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allergyId: string) => {
      if (!petId) throw new Error("petId가 필요합니다.");
      if (!allergyId) throw new Error("allergyId가 필요합니다.");
      return deleteAllergy(petId, allergyId);
    },
    onSuccess: async () => {
      if (!petId) return;
      await queryClient.invalidateQueries({ queryKey: listKey(petId) });
    },
  });
};
