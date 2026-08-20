import WeightForm from "@/components/form/WeightForm";
import { WeightFormValues } from "@/types/weight";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "../ui/actionsheet";

interface WeightFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (values: WeightFormValues) => void | Promise<void>;
}

const WeightFormSheet = ({
  isOpen,
  onClose,
  isSubmitting = false,
  onSubmit,
}: WeightFormSheetProps) => {
  const handleSubmit = async (values: WeightFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // 실패 시 시트 유지 — 토스트는 hook에서 처리
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[52]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="rounded-t-3xl bg-white px-6 pb-8 pt-2">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-200" />
        </ActionsheetDragIndicatorWrapper>

        <View className="mb-4 mt-2 w-full flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-[#0D0F1B]">체중 기록</Text>
            <Text className="mt-1 text-sm text-gray-500">
              오늘 측정한 체중을 기록해 보세요
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="닫기"
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F7] active:opacity-70"
          >
            <Icon as={CloseIcon} size="sm" className="text-gray-500" />
          </Pressable>
        </View>

        <ActionsheetScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isOpen ? (
            <WeightForm
              key="new"
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default WeightFormSheet;
