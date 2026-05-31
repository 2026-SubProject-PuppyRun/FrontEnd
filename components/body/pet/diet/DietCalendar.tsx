import { Text } from "@/components/ui/text";
import { CalendarDayCell, DietDayMarker } from "@/types/diet";
import { View } from "react-native";
import DietDayCell from "./DietDayCell";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface DietCalendarProps {
  cells: CalendarDayCell[];
  dayMarkers: Record<string, DietDayMarker>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DietCalendar = ({
  cells,
  dayMarkers,
  selectedDate,
  onSelectDate,
}: DietCalendarProps) => {
  const weeks: CalendarDayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View className="px-2">
      <View className="flex-row">
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} className="flex-1 items-center py-2">
            <Text
              className={`text-xs font-semibold  ${
                index === 0
                  ? "text-[#FF3B30]"
                  : index === 6
                    ? "text-primary-500"
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
            <DietDayCell
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

export default DietCalendar;
