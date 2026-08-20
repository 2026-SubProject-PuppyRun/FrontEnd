import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { queryKeys } from "../core/queryKeys";

/** 케어 홈 접종 캘린더 진입 시 전체 펫 목록 쿼리를 최신화 */
export const useRefreshAllVaccineLogsOnFocus = (petIds: string[]) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      if (petIds.length === 0) return;
      petIds.forEach((petId) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.vaccines.list(petId),
        });
      });
    }, [petIds, queryClient]),
  );
};
