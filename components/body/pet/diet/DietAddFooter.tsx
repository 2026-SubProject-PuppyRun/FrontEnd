import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { DietMealType } from "@/types/diet";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface DietAddFooterProps {
  onPressAdd: (type?: DietMealType) => void;
}

const DietAddFooter = ({ onPressAdd }: DietAddFooterProps) => (
  <View className="border-t border-gray-100 px-4 py-3">
    <HStack className="items-center gap-2">
      {(["food", "snack"] as DietMealType[]).map((type) => {
        const theme = DIET_MEAL_COLORS[type];
        return (
          <Pressable
            key={type}
            onPress={() => onPressAdd(type)}
            className="min-h-12 flex-1 items-center justify-center rounded-2xl active:opacity-80"
            style={{ backgroundColor: theme.color }}
          >
            <Text className="text-base font-semibold text-white">
              {theme.label} 추가
            </Text>
          </Pressable>
        );
      })}
    </HStack>
    <Button
      onPress={() => onPressAdd()}
      variant="outline"
      className="mt-2 min-h-11 rounded-2xl border-gray-200"
    >
      <ButtonText className="text-[#0D0F1B]">기록 추가</ButtonText>
    </Button>
  </View>
);

export default DietAddFooter;
