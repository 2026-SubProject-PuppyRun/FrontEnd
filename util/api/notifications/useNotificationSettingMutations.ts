import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NotificationOptionCode } from "@/constants/notificationOptions";
import { queryKeys } from "../core/queryKeys";
import {
  type NotificationSettings,
  updateNotificationOption,
  updatePushAgreement,
} from "./api";

const settingsKey = queryKeys.notifications.settings();

export const useUpdatePushAgreementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePushAgreement,
    onMutate: async (isPushAgreed: boolean) => {
      await queryClient.cancelQueries({ queryKey: settingsKey });
      const previous =
        queryClient.getQueryData<NotificationSettings>(settingsKey);
      if (previous) {
        queryClient.setQueryData<NotificationSettings>(settingsKey, {
          ...previous,
          isPushAgreed,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsKey, context.previous);
      }
    },
  });
};

export const useUpdateNotificationOptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      optionCode,
      enabled,
    }: {
      optionCode: NotificationOptionCode;
      enabled: boolean;
    }) => updateNotificationOption(optionCode, enabled),
    onMutate: async ({ optionCode, enabled }) => {
      await queryClient.cancelQueries({ queryKey: settingsKey });
      const previous =
        queryClient.getQueryData<NotificationSettings>(settingsKey);
      if (previous) {
        queryClient.setQueryData<NotificationSettings>(settingsKey, {
          ...previous,
          options: previous.options.map((option) =>
            option.optionCode === optionCode
              ? { ...option, enabled }
              : option,
          ),
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsKey, context.previous);
      }
    },
  });
};
