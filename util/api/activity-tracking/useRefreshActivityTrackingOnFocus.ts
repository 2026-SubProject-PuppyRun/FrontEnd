import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { queryKeys } from "../core/queryKeys";

/** 통계 탭 진입 시 산책 통계 쿼리를 최신화 */
export const useRefreshActivityTrackingOnFocus = () => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityTracking.all,
      });
    }, [queryClient]),
  );
};
