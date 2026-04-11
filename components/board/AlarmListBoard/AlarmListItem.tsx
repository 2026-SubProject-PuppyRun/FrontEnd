import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface AlarmListItemProps {
  title: string;
  dayOfWeek: string;
  time: Date;
  onDelete: () => void;
}

const AlarmListItem = ({
  title,
  dayOfWeek,
  time,
  onDelete,
}: AlarmListItemProps) => {
  return (
    <View className="relative mb-2 h-24 flex-col rounded-lg bg-gray-50 p-4">
      <Text>{title}</Text>
      <View className="flex-row gap-4">
        <Text>매주 {dayOfWeek}</Text>
        <Text>{time.toLocaleTimeString().slice(0, 7)}</Text>
      </View>
      <Pressable className=" absolute bottom-2 right-2" onPress={onDelete}>
        <Ionicons name="trash" size={20} />
      </Pressable>
    </View>
  );
};

export default AlarmListItem;
