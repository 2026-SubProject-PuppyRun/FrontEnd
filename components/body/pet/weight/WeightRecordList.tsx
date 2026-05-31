import WeightCard from "@/components/card/WeightCard";
import { WeightRecord } from "@/types/weight";
import { FlatList, View } from "react-native";
import WeightEmptyState from "./WeightEmptyState";

interface WeightRecordListProps {
  records: WeightRecord[];
  selectedRecordId: string | null;
  onPressRecord: (record: WeightRecord) => void;
  renderListHeader?: () => React.ReactElement;
}

const WeightRecordList = ({
  records,
  selectedRecordId,
  onPressRecord,
  renderListHeader,
}: WeightRecordListProps) => (
  <FlatList
    className="flex-1"
    data={records}
    keyExtractor={(item) => item.id}
    extraData={selectedRecordId}
    nestedScrollEnabled
    contentContainerClassName="gap-3 pb-4"
    contentContainerStyle={records.length === 0 ? { flexGrow: 1 } : undefined}
    ListHeaderComponent={
      renderListHeader ? () => <View>{renderListHeader()}</View> : undefined
    }
    ListEmptyComponent={<WeightEmptyState />}
    renderItem={({ item }) => (
      <View className="px-4">
        <WeightCard
          record={item}
          selected={item.id === selectedRecordId}
          onPress={() => onPressRecord(item)}
        />
      </View>
    )}
  />
);

export default WeightRecordList;
