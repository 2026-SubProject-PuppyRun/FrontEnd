import AllergyFormSheet from "@/components/sheet/AllergyFormSheet";
import { Text } from "@/components/ui/text";
import { useAllergyTab } from "@/hooks/use-allergy-tab";
import { useCallback } from "react";
import { View } from "react-native";
import AllergyAddFooter from "./allergy/AllergyAddFooter";
import AllergyRecordList from "./allergy/AllergyRecordList";
import AllergySummaryBar from "./allergy/AllergySummaryBar";

const AllergyTabBody = () => {
  const {
    petRecords,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    handleDelete,
    shareAllergy,
  } = useAllergyTab();

  const renderListHeader = useCallback(
    () => (
      <View className="gap-4 pb-2">
        <AllergySummaryBar records={petRecords} />
        {petRecords.length > 0 ? (
          <Text className="text-sm font-semibold text-[#0D0F1B]">
            알러지 기록
          </Text>
        ) : null}
      </View>
    ),
    [petRecords],
  );

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <AllergyRecordList
        records={petRecords}
        onPressRecord={openEdit}
        renderListHeader={renderListHeader}
      />
      <AllergyAddFooter onPressAdd={openAdd} onPressShare={shareAllergy} />
      <AllergyFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default AllergyTabBody;
