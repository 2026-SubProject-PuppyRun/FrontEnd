import DietForm from "@/components/form/DietForm";
import { DietFormValues, DietMealType, DietRecord } from "@/types/diet";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

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

  const initialValues = editingRecord ?? (defaultDate ? { date: defaultDate } : undefined);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[78]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-white px-4 pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-300" />
        </ActionsheetDragIndicatorWrapper>
        <Text className="mb-2 text-lg font-bold text-[#0D0F1B]">
          {isEdit ? "식단 수정" : "식단 기록"}
        </Text>
        <ActionsheetScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          {isOpen ? (
            <DietForm
              key={editingRecord?.id ?? `${defaultDate}-${defaultType ?? "new"}`}
              initialValues={initialValues}
              defaultType={defaultType}
              submitLabel={isEdit ? "수정" : "저장"}
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
