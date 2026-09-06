import AllergyCard from "@/components/card/AllergyCard";
import { AllergyRecord } from "@/types/allergy";
import { FlatList, View } from "react-native";
import AllergyEmptyState from "./AllergyEmptyState";

interface AllergyRecordListProps {
  records: AllergyRecord[];
  onPressRecord: (record: AllergyRecord) => void;
  renderListHeader?: () => React.ReactElement;
}

const AllergyRecordList = ({
  records,
  onPressRecord,
  renderListHeader,
}: AllergyRecordListProps) => (
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
    ListEmptyComponent={<AllergyEmptyState />}
    renderItem={({ item }) => (
      <AllergyCard record={item} onPress={() => onPressRecord(item)} />
    )}
  />
);

export default AllergyRecordList;
