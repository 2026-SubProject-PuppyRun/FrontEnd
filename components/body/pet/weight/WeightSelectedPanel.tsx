import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WeightRecord } from "@/types/weight";
import { View } from "react-native";

interface WeightSelectedPanelProps {
  record: WeightRecord | null;
  onPressEdit: (record: WeightRecord) => void;
}

const WeightSelectedPanel = ({ record, onPressEdit }: WeightSelectedPanelProps) => {
  if (!record) return null;

  return (
    <View className="mx-4 mt-3 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3">
      <Text className="text-sm text-gray-500">선택한 기록</Text>
      <View className="mt-1 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-[#0D0F1B]">{record.weight}kg</Text>
          <Text className="mt-1 text-sm text-gray-600">{record.measuredAt}</Text>
          {record.memo ? (
            <Text className="mt-1 text-sm text-gray-600">{record.memo}</Text>
          ) : null}
        </View>
        <Button
          size="sm"
          variant="outline"
          onPress={() => onPressEdit(record)}
          className="rounded-xl border-gray-300"
        >
          <ButtonText className="text-[#0D0F1B]">수정</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default WeightSelectedPanel;
