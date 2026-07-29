import React from "react";
import { Pressable, View } from "react-native";
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

interface CustomAlertProps {
  showAlertDialog: boolean;
  handleClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

const CustomAlert = ({
  showAlertDialog,
  handleClose,
  title,
  description,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
  children,
}: CustomAlertProps) => {
  return (
    <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
      <AlertDialogBackdrop className="bg-[#0D0F1B]/45" />
      <AlertDialogContent
        className="mx-6 w-full max-w-[380px] rounded-3xl border-0 px-5 py-5 shadow-sm"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <AlertDialogHeader className="mb-3 items-start">
          <View className="flex-1 pr-2">
            {title ? (
              <Text className="text-lg font-bold text-[#0D0F1B]">{title}</Text>
            ) : null}
          </View>
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

        <AlertDialogBody className="mb-5 px-0">
          {children ? (
            children
          ) : description ? (
            <View className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
              <Text className="text-sm leading-5 text-gray-500">{description}</Text>
            </View>
          ) : null}
        </AlertDialogBody>

        <AlertDialogFooter className="gap-2 px-0">
          <Pressable
            onPress={handleClose}
            className="h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              {cancelText}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onConfirm?.();
              handleClose();
            }}
            className="h-12 flex-1 items-center justify-center rounded-2xl bg-[#F25857]"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-sm font-semibold text-white">{confirmText}</Text>
          </Pressable>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
