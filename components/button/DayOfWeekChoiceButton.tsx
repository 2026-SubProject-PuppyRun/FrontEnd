import { Text } from "react-native";
import { Pressable } from "../ui/pressable";

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
  return (
    <Pressable onPress={() => handleSelectDayOfWeek(dayOfWeek)}>
      <Text
        className={`${dayOfWeek === selectedDayOfWeek ? "font-bold text-blue-500" : "text-gray-500"}`}
      >
        {dayOfWeek}
      </Text>
    </Pressable>
  );
};

export default DayOfWeekChoiceButton;
