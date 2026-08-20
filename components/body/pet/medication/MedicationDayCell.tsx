import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { MEDICATION_THEME } from "@/constants/medicationTheme";
import { CalendarDayCell, MedicationDayMarker } from "@/types/medication";
import { View } from "react-native";

interface MedicationDayCellProps {
  cell: CalendarDayCell;
  marker?: MedicationDayMarker;
  isSelected: boolean;
  onPress: (date: string) => void;
}

const MedicationDayCell = ({
  cell,
  marker,
  isSelected,
  onPress,
}: MedicationDayCellProps) => {
  if (!cell.date) {
    return <View className="flex-1 items-center py-2" />;
  }

  const dayTextColor = isSelected
    ? "text-white"
    : cell.isToday
      ? "text-[#F25857]"
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
        className={`h-9 w-9 items-center justify-center rounded-full ${
          isSelected
            ? "bg-[#F25857]"
            : cell.isToday
              ? "border-2 border-[#F25857]"
              : ""
        }`}
      >
        <Text className={`text-sm font-medium ${dayTextColor}`}>
          {cell.day}
        </Text>
      </View>

      <View className="mt-0.5 h-2.5 flex-row items-center justify-center gap-0.5">
        {marker && marker.count > 0 ? (
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: MEDICATION_THEME.color }}
          />
        ) : null}
      </View>
    </Pressable>
  );
};

export default MedicationDayCell;
