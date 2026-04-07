import { Text, View } from "react-native";

interface AlarmListItemProps {
  title: string;
  dayOfWeek: string;
  time: string;
}

const AlarmListItem = ({ title, dayOfWeek, time }: AlarmListItemProps) => {
  return (
    <View className="mb-2 flex-col rounded-lg bg-gray-50 p-4">
      <Text>{title}</Text>
      <View className="flex-row gap-4">
        <Text>매주 {dayOfWeek}</Text>
        <Text>{time}</Text>
      </View>
    </View>
  );
};

export default AlarmListItem;
