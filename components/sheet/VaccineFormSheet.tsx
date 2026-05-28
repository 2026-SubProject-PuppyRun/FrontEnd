import VaccineForm from "@/components/form/VaccineForm";
import { VaccineFormValues, VaccineRecord } from "@/types/vaccine";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

interface VaccineFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: VaccineRecord | null;
  onSubmit: (values: VaccineFormValues) => void;
}

const VaccineFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  onSubmit,
}: VaccineFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = (values: VaccineFormValues) => {
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
          {isEdit ? "접종 수정" : "접종 추가"}
        </Text>
        <ActionsheetScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          {isOpen ? (
            <VaccineForm
              key={editingRecord?.id ?? "new"}
              initialValues={editingRecord ?? undefined}
              submitLabel={isEdit ? "수정" : "저장"}
              onSubmit={handleSubmit}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default VaccineFormSheet;
