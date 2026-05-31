import AllergyForm from "@/components/form/AllergyForm";
import { AllergyFormValues, AllergyRecord } from "@/types/allergy";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

interface AllergyFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: AllergyRecord | null;
  onSubmit: (values: AllergyFormValues) => void;
}

const AllergyFormSheet = ({
  isOpen,
  onClose,
  editingRecord,
  onSubmit,
}: AllergyFormSheetProps) => {
  const isEdit = Boolean(editingRecord);

  const handleSubmit = (values: AllergyFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[88]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-white px-4 pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-300" />
        </ActionsheetDragIndicatorWrapper>
        <Text className="mb-2 text-lg font-bold text-[#0D0F1B]">
          {isEdit ? "알러지 수정" : "알러지 추가"}
        </Text>
        <ActionsheetScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          {isOpen ? (
            <AllergyForm
              key={editingRecord?.id ?? "new"}
              initialValues={editingRecord ?? undefined}
              submitLabel={isEdit ? "수정" : "추가"}
              onSubmit={handleSubmit}
            />
          ) : null}
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default AllergyFormSheet;
