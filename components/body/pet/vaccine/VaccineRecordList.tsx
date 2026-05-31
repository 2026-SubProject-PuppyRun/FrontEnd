import VaccineCard from "@/components/card/VaccineCard";
import { VaccineRecord } from "@/types/vaccine";
import { FlatList } from "react-native";
import VaccineEmptyState from "./VaccineEmptyState";

interface VaccineRecordListProps {
  records: VaccineRecord[];
  onPressRecord: (record: VaccineRecord) => void;
}

const VaccineRecordList = ({ records, onPressRecord }: VaccineRecordListProps) => (
  <FlatList
    className="flex-1"
    data={records}
    keyExtractor={(item) => item.id}
    contentContainerClassName="gap-3 p-4"
    contentContainerStyle={records.length === 0 ? { flexGrow: 1 } : undefined}
    ListEmptyComponent={<VaccineEmptyState />}
    renderItem={({ item }) => (
      <VaccineCard record={item} onPress={() => onPressRecord(item)} />
    )}
  />
);

export default VaccineRecordList;
