import { Text } from "@/components/ui/text";
import { View } from "react-native";

const WeightEmptyState = () => (
  <View className="items-center rounded-3xl bg-white px-6 py-10 shadow-sm">
    <Text className="text-2xl">⚖️</Text>
    <Text className="mt-2 text-sm text-gray-500">
      등록된 체중 기록이 없어요
    </Text>
    <Text className="mt-1 text-xs text-gray-400">
      아래 버튼으로 체중을 기록해 보세요
    </Text>
  </View>
);

export default WeightEmptyState;
