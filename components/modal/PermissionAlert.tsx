import {
  PermissionKind,
  usePermissionModalStore,
} from "@/store/usePermissionModalStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Platform, Pressable, View } from "react-native";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { CloseIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";

type PermissionCopy = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  benefits: string[];
  hint: string;
  confirmText: string;
  cancelText: string;
};

const COPY: Record<PermissionKind, PermissionCopy> = {
  location: {
    icon: "location",
    title: "위치 권한이 필요해요",
    description:
      "산책 경로와 주변 날씨를 정확하게 보여주려면 위치 정보가 필요해요.",
    benefits: ["실시간 산책 경로 기록", "우리 동네 날씨·산책 점수"],
    hint: Platform.select({
      ios: "설정 > 퍼피런 > 위치에서 ‘앱을 사용하는 동안’을 허용해 주세요.",
      android: "설정 > 앱 > 퍼피런 > 권한 > 위치에서 허용해 주세요.",
      default: "설정에서 위치 권한을 허용해 주세요.",
    })!,
    confirmText: "설정으로 이동",
    cancelText: "나중에",
  },
  notification: {
    icon: "notifications",
    title: "알림 권한이 필요해요",
    description:
      "산책 리마인드와 중요한 소식을 제때 받으려면 알림 허용이 필요해요.",
    benefits: ["산책·일정 알림", "놓치기 쉬운 업데이트 안내"],
    hint: "설정에서 알림을 허용하면 바로 받아볼 수 있어요.",
    confirmText: "설정으로 이동",
    cancelText: "나중에",
  },
  backgroundLocation: {
    icon: "navigate",
    title: "항상 위치 허용이 필요해요",
    description:
      "화면을 끄거나 다른 앱을 쓰는 동안에도 산책 경로를 이어 기록하려면 ‘항상 허용’이 필요해요.",
    benefits: ["백그라운드 경로 이어쓰기", "끊김 없는 산책 기록"],
    hint: Platform.select({
      ios: "설정 > 퍼피런 > 위치에서 ‘항상’을 선택해 주세요.",
      android: "설정 > 앱 > 퍼피런 > 권한 > 위치 > 항상 허용으로 바꿔 주세요.",
      default: "설정에서 위치를 ‘항상 허용’으로 바꿔 주세요.",
    })!,
    confirmText: "설정으로 이동",
    cancelText: "나중에",
  },
};

const PermissionAlert = () => {
  const visible = usePermissionModalStore((s) => s.visible);
  const kind = usePermissionModalStore((s) => s.kind);
  const onConfirm = usePermissionModalStore((s) => s.onConfirm);
  const onCancel = usePermissionModalStore((s) => s.onCancel);
  const close = usePermissionModalStore((s) => s.close);

  const copy = useMemo(() => (kind ? COPY[kind] : null), [kind]);

  const handleClose = () => {
    onCancel?.();
    close();
  };

  const handleConfirm = () => {
    onConfirm?.();
    close();
  };

  if (!copy) return null;

  return (
    <AlertDialog isOpen={visible} onClose={handleClose}>
      <AlertDialogBackdrop className="bg-[#0D0F1B]/45" />
      <AlertDialogContent
        className="mx-6 w-full max-w-[380px] rounded-3xl border-0 px-5 pb-5 pt-5 shadow-sm"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <AlertDialogHeader className="mb-1 items-start justify-end">
          <Pressable
            onPress={handleClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F7]"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          >
            <Icon as={CloseIcon} size="sm" className="text-gray-500" />
          </Pressable>
        </AlertDialogHeader>

        <View className="mb-4 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0]">
            <Ionicons name={copy.icon} size={30} color="#F25857" />
          </View>
          <Text className="text-center text-xl font-bold text-[#0D0F1B]">
            {copy.title}
          </Text>
        </View>

        <AlertDialogBody className="mb-5 px-0">
          <Text className="mb-4 text-center text-sm leading-5 text-gray-500">
            {copy.description}
          </Text>

          <View className="mb-3 gap-2">
            {copy.benefits.map((benefit) => (
              <View
                key={benefit}
                className="flex-row items-center gap-3 rounded-2xl bg-[#F7F7F7] px-3.5 py-3"
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-[#FFF0F0]">
                  <Ionicons name="checkmark" size={14} color="#F25857" />
                </View>
                <Text className="flex-1 text-sm font-medium text-[#0D0F1B]">
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          <Text className="px-1 text-center text-xs leading-4 text-gray-400">
            {copy.hint}
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter className="gap-2 px-0">
          <Pressable
            onPress={handleClose}
            className="h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              {copy.cancelText}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleConfirm}
            className="h-12 flex-1 items-center justify-center rounded-2xl bg-[#F25857]"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-sm font-semibold text-white">
              {copy.confirmText}
            </Text>
          </Pressable>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PermissionAlert;
