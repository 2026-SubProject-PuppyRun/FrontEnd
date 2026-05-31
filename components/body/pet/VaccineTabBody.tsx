import VaccineFormSheet from "@/components/sheet/VaccineFormSheet";
import { useVaccineTab } from "@/hooks/use-vaccine-tab";
import { View } from "react-native";
import VaccineAddFooter from "./vaccine/VaccineAddFooter";
import VaccineRecordList from "./vaccine/VaccineRecordList";

const VaccineTabBody = () => {
  const {
    petRecords,
    sheetOpen,
    editingRecord,
    openAdd,
    openEdit,
    closeSheet,
    handleSubmit,
    shareVaccine,
    handleDelete,
  } = useVaccineTab();

  return (
    <View className="flex-1 bg-white">
      <VaccineRecordList records={petRecords} onPressRecord={openEdit} />
      <VaccineAddFooter onPressAdd={openAdd} onPressShare={shareVaccine} />
      <VaccineFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default VaccineTabBody;
