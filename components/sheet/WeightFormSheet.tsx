import WeightForm from "@/components/form/WeightForm";
import { WeightFormValues, WeightRecord } from "@/types/weight";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

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
      <ActionsheetContent className="bg-white px-4 pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-300" />
        </ActionsheetDragIndicatorWrapper>
        <Text className="mb-2 text-lg font-bold text-[#0D0F1B]">
          {isEdit ? "체중 수정" : "체중 기록"}
        </Text>
        <ActionsheetScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          {isOpen ? (
            <WeightForm
              key={editingRecord?.id ?? "new"}
              initialValues={editingRecord ?? undefined}
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

export default WeightFormSheet;
