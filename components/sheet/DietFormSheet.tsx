import DietForm from "@/components/form/DietForm";
import { DietFormValues, DietMealType, DietRecord } from "@/types/diet";
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

interface DietFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: DietRecord | null;
  defaultDate?: string | null;
  defaultType?: DietMealType;
  onSubmit: (values: DietFormValues) => void;
  onDelete: () => void;
}

const DietFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  defaultDate,
  defaultType,
  onSubmit,
  onDelete,
}: DietFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = (values: DietFormValues) => {
    onSubmit(values);
    onClose();
  };

  const initialValues =
    editingRecord ?? (defaultDate ? { date: defaultDate } : undefined);

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
              {isEdit ? "식단 수정" : "식단 기록"}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "기록 내용을 수정하거나 삭제할 수 있어요"
                : "오늘 먹인 사료·간식을 기록해 보세요"}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
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
            <DietForm
              key={
                editingRecord?.id ?? `${defaultDate}-${defaultType ?? "new"}`
              }
              initialValues={initialValues}
              defaultType={defaultType}
              submitLabel={isEdit ? "수정하기" : "저장하기"}
              isEdit={isEdit}
              onSubmit={handleSubmit}
              onDelete={onDelete}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default DietFormSheet;
