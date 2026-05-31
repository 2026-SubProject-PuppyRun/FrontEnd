import { Text } from "@/components/ui/text";
import { WeightRecord } from "@/types/weight";
import { Pressable, View } from "react-native";

interface WeightCardProps {
  record: WeightRecord;
  selected?: boolean;
  onPress?: () => void;
}

const WeightCard = ({ record, selected, onPress }: WeightCardProps) => (
  <Pressable
    onPress={onPress}
    className={`rounded-2xl border px-4 py-3 active:opacity-80 ${
      selected
        ? "border-primary-500 bg-primary-50"
        : "border-gray-100 bg-gray-50"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-semibold text-gray-900">
        {record.weight}kg
      </Text>
      <Text className="text-sm text-gray-500">{record.measuredAt}</Text>
    </View>
    {record.memo ? (
      <Text className="mt-2 text-sm text-gray-600">{record.memo}</Text>
    ) : null}
  </Pressable>
);

export default WeightCard;
