import { Text } from "@/components/ui/text";
import { CalendarDayCell, MedicationDayMarker } from "@/types/medication";
import { View } from "react-native";
import MedicationDayCell from "./MedicationDayCell";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface MedicationCalendarProps {
  cells: CalendarDayCell[];
  dayMarkers: Record<string, MedicationDayMarker>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const MedicationCalendar = ({
  cells,
  dayMarkers,
  selectedDate,
  onSelectDate,
}: MedicationCalendarProps) => {
  const weeks: CalendarDayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View className="px-1 pb-2">
      <View className="flex-row">
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} className="flex-1 items-center py-2">
            <Text
              className={`text-xs font-semibold ${
                index === 0
                  ? "text-[#F25857]"
                  : index === 6
                    ? "text-[#2563EB]"
                    : "text-gray-400"
              }`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week) => (
        <View
          key={week[0]?.date ?? week.map((c) => c.day).join("-")}
          className="flex-row"
        >
          {week.map((cell) => (
            <MedicationDayCell
              key={cell.date ?? `pad-${cell.day}`}
              cell={cell}
              marker={cell.date ? dayMarkers[cell.date] : undefined}
              isSelected={cell.date === selectedDate}
              onPress={onSelectDate}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default MedicationCalendar;
