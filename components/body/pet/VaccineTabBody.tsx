import VaccineFormSheet from "@/components/sheet/VaccineFormSheet";
import { useVaccineTab } from "@/hooks/use-vaccine-tab";
import { Text } from "@/components/ui/text";
import { useCallback } from "react";
import { View } from "react-native";
import VaccineAddFooter from "./vaccine/VaccineAddFooter";
import VaccineRecordList from "./vaccine/VaccineRecordList";
import VaccineSummaryBar from "./vaccine/VaccineSummaryBar";

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
    isSubmitting,
  } = useVaccineTab();

  const renderListHeader = useCallback(
    () => (
      <View className="gap-4 pb-2">
        <VaccineSummaryBar records={petRecords} />
        {petRecords.length > 0 ? (
          <Text className="text-sm font-semibold text-[#0D0F1B]">
            접종 기록
          </Text>
        ) : null}
      </View>
    ),
    [petRecords],
  );

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <VaccineRecordList
        records={petRecords}
        onPressRecord={openEdit}
        renderListHeader={renderListHeader}
      />
      <VaccineAddFooter onPressAdd={openAdd} onPressShare={shareVaccine} />
      <VaccineFormSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        editingRecord={editingRecord}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default VaccineTabBody;
