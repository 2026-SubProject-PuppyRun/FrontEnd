import MedicationForm from "@/components/form/MedicationForm";
import { isMedicationDoseUnit } from "@/constants/medicationDoseUnits";
import {
  MedicationFormValues,
  MedicationRecord,
} from "@/types/medication";
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

interface MedicationFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: MedicationRecord | null;
  defaultDate?: string | null;
  isSubmitting?: boolean;
  onSubmit: (values: MedicationFormValues) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const MedicationFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  defaultDate,
  isSubmitting = false,
  onSubmit,
  onDelete,
}: MedicationFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = async (values: MedicationFormValues) => {
    await onSubmit(values);
    onClose();
  };

  const initialValues: Partial<MedicationFormValues> | undefined = editingRecord
    ? {
        name: editingRecord.name,
        doseAmount: editingRecord.doseAmount,
        doseUnit: isMedicationDoseUnit(editingRecord.doseUnit)
          ? editingRecord.doseUnit
          : "tablet",
        date: editingRecord.date,
        time: editingRecord.time,
        memo: editingRecord.memo,
      }
    : defaultDate
      ? { date: defaultDate }
      : undefined;

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
              {isEdit ? "투약 일정 수정" : "투약 일정 등록"}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "일정을 수정하거나 삭제할 수 있어요"
                : "달력에 투약 일정을 등록해 보세요"}
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
            <MedicationForm
              key={editingRecord?.id ?? `${defaultDate ?? "new"}`}
              initialValues={initialValues}
              submitLabel={isEdit ? "수정하기" : "저장하기"}
              isEdit={isEdit}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onDelete={onDelete}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default MedicationFormSheet;
