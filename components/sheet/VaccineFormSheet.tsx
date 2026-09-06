import VaccineForm from "@/components/form/VaccineForm";
import { VaccineFormValues, VaccineRecord } from "@/types/vaccine";
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

interface VaccineFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: VaccineRecord | null;
  isSubmitting?: boolean;
  onSubmit: (values: VaccineFormValues) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const VaccineFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  isSubmitting = false,
  onSubmit,
  onDelete,
}: VaccineFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = async (values: VaccineFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // 실패 시 시트 유지 — 토스트는 hook에서 처리
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      onClose();
    } catch {
      // 실패 시 시트 유지 — 토스트는 hook에서 처리
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[82]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="rounded-t-3xl bg-white px-6 pb-8 pt-2">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-200" />
        </ActionsheetDragIndicatorWrapper>

        <View className="mb-4 mt-2 w-full flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-[#0D0F1B]">
              {isEdit ? "접종 수정" : "접종 추가"}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "기록 내용을 수정하거나 삭제할 수 있어요"
                : "예방접종 이름과 일정을 입력해 보세요"}
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
            <VaccineForm
              key={editingRecord?.id ?? "new"}
              initialValues={editingRecord ?? undefined}
              submitLabel={isEdit ? "수정하기" : "저장하기"}
              isEdit={isEdit}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default VaccineFormSheet;
