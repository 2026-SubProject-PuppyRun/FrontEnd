import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { getNotificationSettings } from "./api";

/** 알림 설정 조회 */
export const useNotificationSettingsQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.notifications.settings(),
    queryFn: getNotificationSettings,
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
