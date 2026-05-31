import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import { CalendarDayCell, DietDayMarker } from "@/types/diet";
import { View } from "react-native";

interface DietDayCellProps {
  cell: CalendarDayCell;
  marker?: DietDayMarker;
  isSelected: boolean;
  onPress: (date: string) => void;
}

const DietDayCell = ({
  cell,
  marker,
  isSelected,
  onPress,
}: DietDayCellProps) => {
  if (!cell.date) {
    return <View className="flex-1 items-center py-2" />;
  }

  const dayTextColor = isSelected
    ? "text-white"
    : cell.isToday
      ? "text-[#FF3B30]"
      : cell.isCurrentMonth
        ? "text-[#0D0F1B]"
        : "text-gray-300";

  return (
    <Pressable
      onPress={() => onPress(cell.date!)}
      className="flex-1 items-center py-1.5 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`${cell.day}일`}
    >
      <View
        className={
          isSelected
            ? "h-9 w-9 items-center justify-center rounded-full bg-primary-300"
            : "h-9 w-9 items-center justify-center rounded-full bg-gray-50"
        }
      >
        <Text className={`text-base font-medium ${dayTextColor}`}>
          {cell.day}
        </Text>
      </View>

      <View className="mt-0.5 h-2.5 flex-row items-center justify-center gap-0.5">
        {marker?.hasFood ? (
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: DIET_MEAL_COLORS.food.color }}
          />
        ) : null}
        {marker?.hasSnack ? (
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: DIET_MEAL_COLORS.snack.color }}
          />
        ) : null}
      </View>
    </Pressable>
  );
};

export default DietDayCell;
