import WeightForm from "@/components/form/WeightForm";
import { WeightFormValues, WeightRecord } from "@/types/weight";
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
  editingRecord?: WeightRecord | null;
  onSubmit: (values: WeightFormValues) => void;
  onDelete: () => void;
}

const WeightFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  onSubmit,
  onDelete,
}: WeightFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = (values: WeightFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[78]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="rounded-t-3xl bg-white px-6 pb-8 pt-2">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-200" />
        </ActionsheetDragIndicatorWrapper>

        <View className="mb-4 mt-2 w-full flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-[#0D0F1B]">
              {isEdit ? "체중 수정" : "체중 기록"}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "기록 내용을 수정하거나 삭제할 수 있어요"
                : "오늘 측정한 체중을 기록해 보세요"}
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
            <WeightForm
              key={editingRecord?.id ?? "new"}
              initialValues={editingRecord ?? undefined}
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

export default WeightFormSheet;
