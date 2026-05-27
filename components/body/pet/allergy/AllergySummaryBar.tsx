import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface AllergySummaryBarProps {
  summary: string;
}

const AllergySummaryBar = ({ summary }: AllergySummaryBarProps) => {
  if (!summary) return null;

  return (
    <View className="border-b border-gray-100 px-4 py-3">
      <Text className="text-xs text-gray-500">현재 해당</Text>
      <Text className="mt-0.5 text-sm text-gray-800">{summary}</Text>
    </View>
  );
};

export default AllergySummaryBar;
