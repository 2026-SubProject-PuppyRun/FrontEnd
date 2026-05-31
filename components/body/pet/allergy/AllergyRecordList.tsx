import AllergyCard from "@/components/card/AllergyCard";
import { AllergyRecord } from "@/types/allergy";
import { FlatList } from "react-native";
import AllergyEmptyState from "./AllergyEmptyState";

interface AllergyRecordListProps {
  records: AllergyRecord[];
  onPressRecord: (record: AllergyRecord) => void;
}

const AllergyRecordList = ({
  records,
  onPressRecord,
}: AllergyRecordListProps) => (
  <FlatList
    className="flex-1"
    data={records}
    keyExtractor={(item) => item.id}
    contentContainerClassName="gap-3 p-4"
    contentContainerStyle={records.length === 0 ? { flexGrow: 1 } : undefined}
    ListEmptyComponent={<AllergyEmptyState />}
    renderItem={({ item }) => (
      <AllergyCard record={item} onPress={() => onPressRecord(item)} />
    )}
  />
);

export default AllergyRecordList;
