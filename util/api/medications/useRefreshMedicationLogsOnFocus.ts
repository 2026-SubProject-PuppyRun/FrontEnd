import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { queryKeys } from "../core/queryKeys";

/** 투약 탭 진입 시 목록 쿼리를 최신화 */
export const useRefreshMedicationLogsOnFocus = (petId?: string) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      if (!petId) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.medications.list(petId),
      });
    }, [petId, queryClient]),
  );
};
