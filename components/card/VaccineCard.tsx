import { Text } from "@/components/ui/text";
import { VaccineRecord } from "@/types/vaccine";
import { Pressable, View } from "react-native";

interface VaccineCardProps {
  record: VaccineRecord;
  onPress?: () => void;
}

const VaccineCard = ({ record, onPress }: VaccineCardProps) => (
  <Pressable
    onPress={onPress}
    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 active:opacity-80"
  >
    <Text className="text-base font-semibold text-gray-900">{record.name}</Text>
    <View className="mt-2">
      <Text className="text-sm text-gray-600">접종일: {record.vaccinatedAt}</Text>
      <Text className="mt-1 text-sm text-gray-600">
        다음 접종일: {record.nextVaccinationAt}
      </Text>
    </View>
  </Pressable>
);

export default VaccineCard;
