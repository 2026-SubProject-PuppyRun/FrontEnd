import VaccineCard from "@/components/card/VaccineCard";
import { VaccineRecord } from "@/types/vaccine";
import { FlatList, View } from "react-native";
import VaccineEmptyState from "./VaccineEmptyState";

interface VaccineRecordListProps {
  records: VaccineRecord[];
  onPressRecord: (record: VaccineRecord) => void;
  renderListHeader?: () => React.ReactElement;
}

const VaccineRecordList = ({
  records,
  onPressRecord,
  renderListHeader,
}: VaccineRecordListProps) => (
  <FlatList
    className="flex-1"
    data={records}
    keyExtractor={(item) => item.id}
    contentContainerClassName="gap-3 pb-36 pt-1"
    contentContainerStyle={records.length === 0 ? { flexGrow: 1 } : undefined}
    showsVerticalScrollIndicator={false}
    ListHeaderComponent={
      renderListHeader ? () => <View>{renderListHeader()}</View> : undefined
    }
    ListEmptyComponent={<VaccineEmptyState />}
    renderItem={({ item }) => (
      <VaccineCard record={item} onPress={() => onPressRecord(item)} />
    )}
  />
);

export default VaccineRecordList;
