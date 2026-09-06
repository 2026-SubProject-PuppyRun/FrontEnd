import { Text } from "@/components/ui/text";
import { AllergyRecord } from "@/types/allergy";
import { buildActiveAllergySummary } from "@/util/allergy";
import { View } from "react-native";

interface AllergySummaryBarProps {
  records: AllergyRecord[];
}

const AllergySummaryBar = ({ records }: AllergySummaryBarProps) => {
  const activeRecords = records.filter((record) => record.isActive);
  const summary = buildActiveAllergySummary(records);

  return (
    <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
      <Text className="text-sm text-gray-500">현재 해당 알러지</Text>

      {activeRecords.length > 0 ? (
        <>
          <Text className="mt-1 text-xl font-bold text-[#0D0F1B]">
            {activeRecords.length}건
          </Text>
          {summary ? (
            <Text className="mt-2 text-sm text-gray-600">{summary}</Text>
          ) : null}
        </>
      ) : (
        <Text className="mt-1 text-base font-medium text-gray-400">
          현재 해당 알러지가 없어요
        </Text>
      )}

      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <Text className="text-xs text-gray-500">총 {records.length}건</Text>
        {records.length === 0 ? (
          <Text className="text-xs text-gray-400">기록을 추가해 보세요</Text>
        ) : null}
      </View>
    </View>
  );
};

export default AllergySummaryBar;
