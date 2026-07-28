import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import { DietMealType } from "@/types/diet";
import { View } from "react-native";

interface DietAddFooterProps {
  onPressAdd: (type?: DietMealType) => void;
}

const DietAddFooter = ({ onPressAdd }: DietAddFooterProps) => (
  <View className="absolute bottom-0 left-0 right-0 rounded-3xl border-t border-gray-100 bg-white px-6 pb-6 pt-4">
    <HStack className="mb-3 gap-2">
      {(["food", "snack"] as DietMealType[]).map((type) => {
        const theme = DIET_MEAL_COLORS[type];
        return (
          <Pressable
            key={type}
            onPress={() => onPressAdd(type)}
            className="min-h-12 flex-1 items-center justify-center rounded-2xl active:opacity-80"
            style={{
              backgroundColor: theme.bg,
              borderWidth: 1,
              borderColor: theme.color + "33",
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.color }}
            >
              + {theme.label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  </View>
);

export default DietAddFooter;
