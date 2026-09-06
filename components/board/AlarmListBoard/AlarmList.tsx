import { AlarmItem } from "@/components/body/AlarmBody";
import { Text } from "@/components/ui/text";
import { deleteLocalNotification } from "@/util/notification";
import { ActivityIndicator, View } from "react-native";
import AlarmListItem from "./AlarmListItem";

interface AlarmListProps {
  alarmList: AlarmItem[];
  setAlarmList: React.Dispatch<React.SetStateAction<AlarmItem[]>>;
  isLoading?: boolean;
  onDeleted?: () => void | Promise<void>;
}

const formatTime = (time: Date) =>
  time.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const AlarmList = ({
  alarmList,
  setAlarmList,
  isLoading = false,
  onDeleted,
}: AlarmListProps) => {
  if (isLoading) {
    return (
      <View className="items-center rounded-3xl bg-white px-6 py-10 shadow-sm">
        <ActivityIndicator color="#F25857" />
        <Text className="mt-3 text-sm text-gray-500">알람을 불러오는 중…</Text>
      </View>
    );
  }

  if (alarmList.length === 0) {
    return (
      <View className="items-center rounded-3xl bg-white px-6 py-10 shadow-sm">
        <Text className="text-base font-semibold text-[#0D0F1B]">
          등록된 알람이 없어요
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-500">
          요일과 시간을 선택한 뒤 알람을 추가해보세요
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {alarmList.map((item) => (
        <AlarmListItem
          key={item.notificationId}
          title={item.title}
          dayOfWeek={item.dayOfWeek}
          timeLabel={formatTime(item.time)}
          onDelete={() => {
            void (async () => {
              setAlarmList((prev) =>
                prev.filter(
                  (alarm) => alarm.notificationId !== item.notificationId,
                ),
              );
              await deleteLocalNotification(item.notificationId);
              await onDeleted?.();
            })();
          }}
        />
      ))}
    </View>
  );
};

export default AlarmList;
