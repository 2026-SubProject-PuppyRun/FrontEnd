import { Button, ButtonText } from "@/components/ui/button";
import { View } from "react-native";

interface WeightAddFooterProps {
  onPressAdd: () => void;
}

const WeightAddFooter = ({ onPressAdd }: WeightAddFooterProps) => (
  <View className="border-t border-gray-100 px-4 py-3">
    <Button
      onPress={onPressAdd}
      className="min-h-12 rounded-2xl bg-primary-500"
    >
      <ButtonText>체중 기록 추가</ButtonText>
    </Button>
  </View>
);

export default WeightAddFooter;
