import { MEDICATION_THEME } from "@/constants/medicationTheme";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

const MedicationLegend = () => (
  <View className="flex-row items-center justify-end px-2 pb-1">
    <View
      className="h-2 w-2 rounded-full"
      style={{ backgroundColor: MEDICATION_THEME.color }}
    />
    <Text className="ml-1.5 text-xs text-gray-500">투약 일정</Text>
  </View>
);

export default MedicationLegend;
