import { Text } from "@/components/ui/text";
import { AllergyRecord } from "@/types/allergy";
import {
  ALLERGY_CATEGORY_COLORS,
  buildActiveAllergySummary,
  getCategoryLabel,
} from "@/util/allergy";
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
          <View className="mt-3 flex-row flex-wrap gap-2">
            {Object.entries(
              activeRecords.reduce(
                (acc, record) => {
                  acc[record.category] = (acc[record.category] ?? 0) + 1;
                  return acc;
                },
                {} as Partial<Record<AllergyRecord["category"], number>>,
              ),
            ).map(([category, count]) => {
              const theme =
                ALLERGY_CATEGORY_COLORS[
                  category as AllergyRecord["category"]
                ];
              return (
                <View
                  key={category}
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: theme.bg }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: theme.color }}
                  >
                    {getCategoryLabel(category as AllergyRecord["category"])}{" "}
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <Text className="mt-1 text-base font-medium text-gray-400">
          현재 해당 알러지가 없어요
        </Text>
      )}

      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <Text className="text-xs text-gray-500">총 {records.length}건</Text>
        {summary ? (
          <Text className="text-xs text-gray-400">{summary}</Text>
        ) : (
          <Text className="text-xs text-gray-400">기록을 추가해 보세요</Text>
        )}
      </View>
    </View>
  );
};

export default AllergySummaryBar;
