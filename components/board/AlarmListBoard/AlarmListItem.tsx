import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface AlarmListItemProps {
  title: string;
  dayOfWeek: string;
  timeLabel: string;
  onDelete: () => void;
}

const AlarmListItem = ({
  title,
  dayOfWeek,
  timeLabel,
  onDelete,
}: AlarmListItemProps) => {
  return (
    <View className="flex-row items-center rounded-3xl bg-white px-5 py-4 shadow-sm">
      <View className="mr-4 min-w-[72px]">
        <Text className="text-2xl font-bold text-[#0D0F1B]">{timeLabel}</Text>
        <View className="mt-1 self-start rounded-full bg-[#FFF0F0] px-2.5 py-0.5">
          <Text className="text-xs font-semibold text-[#F25857]">
            매주 {dayOfWeek}
          </Text>
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-base font-semibold text-[#0D0F1B]"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <Pressable
        onPress={onDelete}
        className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7]"
        accessibilityRole="button"
        accessibilityLabel="알람 삭제"
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      >
        <Ionicons name="trash-outline" size={18} color="#F25857" />
      </Pressable>
    </View>
  );
};

export default AlarmListItem;
