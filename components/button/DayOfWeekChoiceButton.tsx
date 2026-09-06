import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";

interface DayOfWeekChoiceButtonProps {
  dayOfWeek: string;
  selectedDayOfWeek: string;
  handleSelectDayOfWeek: (dayOfWeek: string) => void;
}

const DayOfWeekChoiceButton = ({
  dayOfWeek,
  selectedDayOfWeek,
  handleSelectDayOfWeek,
}: DayOfWeekChoiceButtonProps) => {
  const isSelected = dayOfWeek === selectedDayOfWeek;

  return (
    <Pressable
      onPress={() => handleSelectDayOfWeek(dayOfWeek)}
      className={`h-10 w-10 items-center justify-center rounded-full ${
        isSelected ? "bg-[#F25857]" : "bg-[#F7F7F7]"
      }`}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <Text
        className={`text-sm font-semibold ${
          isSelected ? "text-white" : "text-gray-500"
        }`}
      >
        {dayOfWeek}
      </Text>
    </Pressable>
  );
};

export default DayOfWeekChoiceButton;
