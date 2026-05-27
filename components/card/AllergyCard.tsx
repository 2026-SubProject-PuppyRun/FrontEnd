import { AllergyRecord } from "@/types/allergy";
import {
  formatAllergyDate,
  getCategoryLabel,
  getSeverityLabel,
} from "@/util/allergy";
import { Pressable, Text, View } from "react-native";

interface AllergyCardProps {
  record: AllergyRecord;
  onPress?: () => void;
}

const AllergyCard = ({ record, onPress }: AllergyCardProps) => {
  const dateLabel = formatAllergyDate(record.diagnosedAt);

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 active:opacity-80"
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-xs font-medium text-gray-500">
              {getCategoryLabel(record.category)}
            </Text>
            {!record.isActive ? (
              <Text className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                비활성
              </Text>
            ) : null}
          </View>
          <Text className="mt-1 text-base font-semibold text-gray-900">
            {record.allergen}
          </Text>
        </View>
        {record.severity ? (
          <Text className="text-xs font-medium text-primary-600">
            {getSeverityLabel(record.severity)}
          </Text>
        ) : null}
      </View>

      {record.symptoms ? (
        <Text className="mt-2 text-sm text-gray-600" numberOfLines={2}>
          {record.symptoms}
        </Text>
      ) : null}

      {dateLabel ? (
        <Text className="mt-1 text-xs text-gray-400">{dateLabel}</Text>
      ) : null}
    </Pressable>
  );
};

export default AllergyCard;
