import { Text } from "@/components/ui/text";
import { View } from "react-native";

const AllergyEmptyState = () => (
  <View className="items-center py-16">
    <Text className="text-base text-gray-500">등록된 알러지가 없어요</Text>
    <Text className="mt-1 text-sm text-gray-400">
      아래 버튼으로 기록을 추가해보세요
    </Text>
  </View>
);

export default AllergyEmptyState;
