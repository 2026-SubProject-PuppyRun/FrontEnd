import { getTargetDate } from "@/util/date";
import { scheduleLocalNotification } from "@/util/notification";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import AlarmList from "../board/AlarmListBoard/AlarmList";
import DayOfWeekChoiceButton from "../button/DayOfWeekChoiceButton";
import CustomAlert from "../modal/CustomAlert";
import { Button, ButtonText } from "../ui/button";

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
  const [alarmTitle, setAlarmTitle] = useState("");
  const [alarmList, setAlarmList] = useState<AlarmItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      //서버에서 알람 리스트를 가져오는 API 호출을 하는 부분입니다.

      setAlarmList(dummyAlarmList);
      return () => {
        //서버에 알람 리스트를 저장하는 API 호출을 하는 부분입니다.
      };
    }, []),
  );

  return (
    <View className="m-4 flex-1 rounded-lg bg-white p-4 ">
      <View className=" m-4 flex-row items-center justify-around pb-4">
        {daysOfWeek.map((day) => (
          <DayOfWeekChoiceButton
            key={day.value}
            dayOfWeek={day.label}
            selectedDayOfWeek={dayOfWeek}
            handleSelectDayOfWeek={setDayOfWeek}
          />
        ))}
      </View>

      <View className=" items-center justify-center ">
        <DatePicker
          date={date}
          onDateChange={setDate}
          mode="time"
          theme="light"
          style={{ transform: [{ scale: 1.2 }] }}
        />
      </View>
      <View className="mt-2 w-full flex-row justify-end">
        <TextInput
          className="flex-1 border-b border-gray-300 px-4 py-2 placeholder:color-gray-400"
          placeholder="알람 제목을 입력하세요"
          value={alarmTitle}
          onChangeText={setAlarmTitle}
        />

        <Button
          className="ml-2 h-10 rounded-full px-4 py-2"
          onPress={() => {
            setShowAlertDialog(true);
          }}
        >
          <ButtonText className="text-sm ">추가</ButtonText>
        </Button>
      </View>
      <AlarmList alarmList={alarmList} setAlarmList={setAlarmList} />
      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={() => setShowAlertDialog(false)}
        title="알림이 추가되었습니다."
        description={`제목: ${alarmTitle}, 요일: ${dayOfWeek}, 시간: ${date.toLocaleTimeString().slice(0, 7)} `}
        confirmText="확인"
        cancelText="취소"
        onConfirm={async () => {
          const newAlarmDate = getTargetDate(dayOfWeek, date);

          const notiId = await scheduleLocalNotification(
            alarmTitle,
            newAlarmDate,
            {
              body: `퍼피런에서 온 알림입니다!`,
              smallIcon: "ic_launcher",
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
                title: alarmTitle,
                notificationId: notiId,
              },
            ];
            return newList.sort((a, b) => {
              const dayA = dayOrder.indexOf(a.dayOfWeek);
              const dayB = dayOrder.indexOf(b.dayOfWeek);
              return dayA - dayB;
            });
          });
          setAlarmTitle("");
          setShowAlertDialog(false);
        }}
      />
    </View>
  );
};

export default AlarmBody;
