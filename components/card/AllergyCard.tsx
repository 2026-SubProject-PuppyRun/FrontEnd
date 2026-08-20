import { Text } from "@/components/ui/text";
import { AllergyRecord } from "@/types/allergy";
import {
  ALLERGY_SEVERITY_COLORS,
  formatAllergyDate,
  getSeverityLabel,
} from "@/util/allergy";
import { Pressable, View } from "react-native";

interface AllergyCardProps {
  record: AllergyRecord;
  onPress?: () => void;
}

const AllergyCard = ({ record, onPress }: AllergyCardProps) => {
  const severityTheme = record.severity
    ? ALLERGY_SEVERITY_COLORS[record.severity]
    : null;
  const dateLabel = formatAllergyDate(record.diagnosedAt);

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border px-4 py-3 shadow-sm active:opacity-80 ${
        record.isActive
          ? "border-gray-100 bg-white"
          : "border-gray-100 bg-[#FAFAFA] opacity-80"
      }`}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-base font-semibold text-[#0D0F1B]">
              {record.allergen}
            </Text>
            {!record.isActive ? (
              <View className="rounded-full bg-gray-200 px-2.5 py-1">
                <Text className="text-xs font-medium text-gray-600">
                  알러지 해제
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        {severityTheme && record.severity ? (
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: severityTheme.bg }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: severityTheme.color }}
            >
              {getSeverityLabel(record.severity)}
            </Text>
          </View>
        ) : null}
      </View>

      {record.symptoms ? (
        <Text className="mt-2 text-sm text-gray-500" numberOfLines={2}>
          {record.symptoms}
        </Text>
      ) : null}

      {dateLabel ? (
        <Text className="mt-2 text-xs text-gray-400">진단일 {dateLabel}</Text>
      ) : null}
    </Pressable>
  );
};

export default AllergyCard;
