import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import { DietMealType } from "@/types/diet";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

const DietLegend = () => (
  <HStack className="items-center justify-center gap-5 px-4 py-3">
    {(["food", "snack"] as DietMealType[]).map((type) => {
      const theme = DIET_MEAL_COLORS[type];
      return (
        <HStack key={type} className="items-center gap-2">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.color }}
          />
          <Text className="text-sm text-[#0D0F1B]">{theme.label}</Text>
        </HStack>
      );
    })}
  </HStack>
);

export default DietLegend;
