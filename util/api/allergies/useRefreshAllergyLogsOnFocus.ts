import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { queryKeys } from "../core/queryKeys";

/** 알러지 탭 진입 시 목록 쿼리를 최신화 */
export const useRefreshAllergyLogsOnFocus = (petId?: string) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      if (!petId) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.allergies.list(petId),
      });
    }, [petId, queryClient]),
  );
};
