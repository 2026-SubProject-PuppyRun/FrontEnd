import AllergyForm from "@/components/form/AllergyForm";
import { AllergyFormValues, AllergyRecord } from "@/types/allergy";
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

interface AllergyFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: AllergyRecord | null;
  isSubmitting?: boolean;
  onSubmit: (values: AllergyFormValues) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const AllergyFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  isSubmitting = false,
  onSubmit,
  onDelete,
}: AllergyFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = async (values: AllergyFormValues) => {
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

  const initialValues: Partial<AllergyFormValues> | undefined = editingRecord
    ? {
        allergen: editingRecord.allergen,
        severity: editingRecord.severity,
        symptoms: editingRecord.symptoms,
        diagnosedAt: editingRecord.diagnosedAt ?? null,
        isActive: editingRecord.isActive,
        memo: editingRecord.memo,
      }
    : undefined;

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[92]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="rounded-t-3xl bg-white px-6 pb-8 pt-2">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-200" />
        </ActionsheetDragIndicatorWrapper>

        <View className="mb-4 mt-2 w-full flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-[#0D0F1B]">
              {isEdit ? "알러지 수정" : "알러지 추가"}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "기록 내용을 수정하거나 삭제할 수 있어요"
                : "알러지 유발 물질과 증상을 기록해 보세요"}
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
            <AllergyForm
              key={editingRecord?.id ?? "new"}
              initialValues={initialValues}
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

export default AllergyFormSheet;
