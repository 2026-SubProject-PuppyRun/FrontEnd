import AlarmSetSwitch from "@/components/switch/AlarmSetSwitch";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import { Text } from "@/components/ui/text";
import {
  NOTIFICATION_OPTION_CODES,
  NOTIFICATION_OPTION_LABELS,
  type NotificationOptionCode,
} from "@/constants/notificationOptions";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { ApiError } from "@/util/api/core/errors";
import {
  useNotificationSettingsQuery,
  useUpdateNotificationOptionMutation,
  useUpdatePushAgreementMutation,
} from "@/util/api/notifications";
import {
  registerPushConsentOnAllow,
  requestUserPermission,
} from "@/util/notification";
import { CloseIcon } from "@/components/ui/icon";
import { useMemo, useState } from "react";
import { Linking, Pressable, View } from "react-native";

type PendingKey = "push" | NotificationOptionCode | null;

const NotificationSettingsSection = () => {
  const toast = useCustomToast();
  const [pendingKey, setPendingKey] = useState<PendingKey>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotificationSettingsQuery();

  const pushMutation = useUpdatePushAgreementMutation();
  const optionMutation = useUpdateNotificationOptionMutation();

  const isNotFound =
    error instanceof ApiError && error.isNotFound;

  const optionMap = useMemo(() => {
    const map = new Map<NotificationOptionCode, boolean>();
    for (const code of NOTIFICATION_OPTION_CODES) {
      map.set(code, false);
    }
    data?.options.forEach((option) => {
      map.set(option.optionCode, option.enabled);
    });
    return map;
  }, [data?.options]);

  const showErrorToast = () => {
    toast.showToast({
      message: "알림 설정 변경에 실패했습니다. 다시 시도해주세요.",
      icon: CloseIcon,
    });
  };

  const ensureNotificationSetup = async () => {
    const permitted = await requestUserPermission();
    if (!permitted) {
      toast.showToast({
        message: "기기 알림 권한을 허용해야 푸시를 받을 수 있어요.",
      });
      Linking.openSettings();
      return false;
    }

    await registerPushConsentOnAllow();
    await refetch();
    return true;
  };

  const handlePushToggle = async () => {
    if (pendingKey) return;

    setPendingKey("push");
    try {
      if (isNotFound || !data) {
        const ready = await ensureNotificationSetup();
        if (!ready) return;
        toast.showToast({ message: "알림 설정이 등록되었습니다." });
        return;
      }

      const nextValue = !data.isPushAgreed;
      if (nextValue) {
        const permitted = await requestUserPermission();
        if (!permitted) {
          toast.showToast({
            message: "기기 알림 권한을 허용해야 푸시를 받을 수 있어요.",
          });
          Linking.openSettings();
          return;
        }
      }

      await pushMutation.mutateAsync(nextValue);
      toast.showToast({ message: "알림 설정이 변경되었습니다." });
    } catch {
      showErrorToast();
    } finally {
      setPendingKey(null);
    }
  };

  const handleOptionToggle = async (optionCode: NotificationOptionCode) => {
    if (!data?.isPushAgreed || pendingKey) return;

    const nextValue = !optionMap.get(optionCode);
    setPendingKey(optionCode);
    try {
      await optionMutation.mutateAsync({ optionCode, enabled: nextValue });
      toast.showToast({ message: "알림 설정이 변경되었습니다." });
    } catch (mutationError) {
      if (
        mutationError instanceof ApiError &&
        (mutationError.status === 400 || mutationError.status === 403)
      ) {
        toast.showToast({
          message: "전체 푸시 수신을 먼저 켜주세요.",
        });
        await refetch();
        return;
      }
      showErrorToast();
    } finally {
      setPendingKey(null);
    }
  };

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError && !isNotFound) {
    return (
      <View className="items-center rounded-2xl bg-[#F7F7F7] px-4 py-6">
        <Text className="text-center text-sm text-gray-500">
          알림 설정을 불러오지 못했어요.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-3 rounded-full bg-white px-4 py-2"
        >
          <Text className="text-sm font-semibold text-[#F25857]">
            다시 시도
          </Text>
        </Pressable>
      </View>
    );
  }

  if (isNotFound || !data) {
    return (
      <View className="gap-3">
        <View className="rounded-2xl bg-[#FFF3F3] px-4 py-4">
          <Text className="text-sm font-semibold text-[#0D0F1B]">
            푸시 알림을 아직 설정하지 않았어요
          </Text>
          <Text className="mt-1 text-xs leading-5 text-gray-500">
            기기 알림을 허용하면 산책 리마인더와 공지를 받을 수 있어요.
          </Text>
        </View>
        <AlarmSetSwitch
          alarmName="푸시 알림 받기"
          description="알림 권한 허용 후 서버에 기기를 등록해요"
          isEnabled={false}
          onToggle={handlePushToggle}
          disabled={pendingKey === "push"}
        />
      </View>
    );
  }

  const canEditOptions = data.isPushAgreed;

  return (
    <View className="gap-3">
      <AlarmSetSwitch
        alarmName="전체 푸시 수신"
        description="꺼두면 아래 유형별 알림을 변경할 수 없어요"
        isEnabled={data.isPushAgreed}
        onToggle={handlePushToggle}
        disabled={pendingKey === "push"}
      />

      {NOTIFICATION_OPTION_CODES.map((optionCode) => (
        <AlarmSetSwitch
          key={optionCode}
          alarmName={NOTIFICATION_OPTION_LABELS[optionCode]}
          isEnabled={optionMap.get(optionCode) ?? false}
          onToggle={() => handleOptionToggle(optionCode)}
          disabled={!canEditOptions || pendingKey === optionCode}
        />
      ))}

      {!canEditOptions ? (
        <Text className="px-1 text-xs leading-5 text-gray-400">
          유형별 알림을 바꾸려면 전체 푸시 수신을 켜주세요.
        </Text>
      ) : null}
    </View>
  );
};

export default NotificationSettingsSection;
