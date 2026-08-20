import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { getTargetDate } from "@/util/date";
import { scheduleLocalNotification } from "@/util/notification";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import AlarmList from "../board/AlarmListBoard/AlarmList";
import DayOfWeekChoiceButton from "../button/DayOfWeekChoiceButton";
import CustomAlert from "../modal/CustomAlert";

const daysOfWeek = [
  { label: "일", value: "sun" },
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
];

export interface AlarmItem {
  title: string;
  dayOfWeek: string;
  time: Date;
  notificationId?: string;
}

const dummyAlarmList: AlarmItem[] = [
  {
    title: "산책 시간이에요!",
    dayOfWeek: "월",
    time: new Date("2024-01-01T15:00:00"),
  },
  {
    title: "밥 먹을 시간이에요!",
    dayOfWeek: "화",
    time: new Date("2024-01-01T18:00:00"),
  },
  {
    title: "약 먹을 시간이에요!",
    dayOfWeek: "수",
    time: new Date("2024-01-01T09:00:00"),
  },
];

const AlarmBody = () => {
  const [date, setDate] = useState(new Date());
  const today = new Date().getDay();
  const [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[today].label);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alarmBody, setAlarmBody] = useState("");
  const [alarmList, setAlarmList] = useState<AlarmItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      setAlarmList(dummyAlarmList);
      return () => {};
    }, []),
  );

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-5 rounded-3xl bg-white px-5 py-5 shadow-sm">
        <Text className="mb-4 text-sm font-semibold text-gray-500">
          새 알람 추가
        </Text>

        <Text className="mb-3 text-xs font-medium text-gray-500">요일</Text>
        <View className="mb-5 flex-row justify-between">
          {daysOfWeek.map((day) => (
            <DayOfWeekChoiceButton
              key={day.value}
              dayOfWeek={day.label}
              selectedDayOfWeek={dayOfWeek}
              handleSelectDayOfWeek={setDayOfWeek}
            />
          ))}
        </View>

        <Text className="mb-2 text-xs font-medium text-gray-500">시간</Text>
        <View className="items-center rounded-2xl bg-[#F7F7F7] py-2">
          <DatePicker
            date={date}
            onDateChange={setDate}
            mode="time"
            theme="light"
            locale="ko"
          />
        </View>

        <Text className="mb-2 mt-5 text-xs font-medium text-gray-500">
          알람 제목
        </Text>
        <TextInput
          className="rounded-2xl bg-[#F7F7F7] px-4 py-3.5 text-base text-[#0D0F1B]"
          placeholder="예: 산책 시간이에요!"
          placeholderTextColor="#9CA3AF"
          value={alarmBody}
          onChangeText={setAlarmBody}
        />

        <View className="mt-5">
          <RedButtonSurface
            borderRadius={30}
            backgroundColor="#F25857"
            shadowPadding={8}
            hostStyle={{ width: "100%" }}
            style={{ width: "100%", height: 52 }}
          >
            <Pressable
              onPress={() => setShowAlertDialog(true)}
              className="h-full w-full items-center justify-center"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-base font-semibold text-white">
                알람 추가하기
              </Text>
            </Pressable>
          </RedButtonSurface>
        </View>
      </View>

      <Text className="mb-3 text-base font-semibold text-[#0D0F1B]">
        등록된 알람
      </Text>
      <AlarmList alarmList={alarmList} setAlarmList={setAlarmList} />

      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={() => setShowAlertDialog(false)}
        title="알람을 추가할까요?"
        description={`${dayOfWeek}요일 ${formattedTime} · ${alarmBody || "내용 없음"}`}
        confirmText="추가"
        cancelText="취소"
        onConfirm={async () => {
          const newAlarmDate = getTargetDate(dayOfWeek, date);

          const notiId = await scheduleLocalNotification(
            "알림이 도착했어요",
            newAlarmDate,
            {
              body: alarmBody,
            },
            "puppyrun_alarm_channel",
          );

          setAlarmList((prev) => {
            const dayOrder = ["일", "월", "화", "수", "목", "금", "토"];
            const newList = [
              ...prev,
              {
                dayOfWeek,
                time: date,
                title: alarmBody,
                notificationId: notiId,
              },
            ];
            return newList.sort((a, b) => {
              const dayA = dayOrder.indexOf(a.dayOfWeek);
              const dayB = dayOrder.indexOf(b.dayOfWeek);
              return dayA - dayB;
            });
          });
          setAlarmBody("");
          setShowAlertDialog(false);
        }}
      />
    </ScrollView>
  );
};

export default AlarmBody;
