import AllergyFormSheet from "@/components/sheet/AllergyFormSheet";
import { useAllergyTab } from "@/hooks/use-allergy-tab";
import { View } from "react-native";
import AllergyAddFooter from "./allergy/AllergyAddFooter";
import AllergyRecordList from "./allergy/AllergyRecordList";
import AllergySummaryBar from "./allergy/AllergySummaryBar";

const AllergyTabBody = () => {
  const {
    petRecords,
    activeSummary,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    shareAllergy,
  } = useAllergyTab();

  return (
    <View className="flex-1 bg-white">
      <AllergySummaryBar summary={activeSummary} />
      <AllergyRecordList records={petRecords} onPressRecord={openEdit} />
      <AllergyAddFooter onPressAdd={openAdd} onPressShare={shareAllergy} />
      <AllergyFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default AllergyTabBody;
