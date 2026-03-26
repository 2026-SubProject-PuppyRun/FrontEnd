import { useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";
import DayOfWeekChoiceButton from "../button/DayOfWeekChoiceButton";
import CustomAlert from "../modal/CustomAlert";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { RepeatIcon } from "../ui/icon";

const daysOfWeek = [
  { label: "일", value: "sun" },
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
];
const AlarmBody = () => {
  const [date, setDate] = useState(new Date());
  const today = new Date().getDay();
  const [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[today].label);
  const [repeat, setRepeat] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

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
      <View className="w-full flex-row justify-end">
        <Button
          className="h-10 w-10 rounded-full p-3.5"
          onPress={() => setRepeat((prev) => !prev)}
        >
          <ButtonIcon as={RepeatIcon} color={repeat ? "#26170F" : "#BFB8AA"} />
        </Button>
        <Button
          className="ml-2 h-10 rounded-full px-4 py-2"
          onPress={() => {
            setShowAlertDialog(true);
          }}
        >
          <ButtonText className="text-sm ">저장</ButtonText>
        </Button>
      </View>
      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={() => setShowAlertDialog(false)}
        title="알림이 저장되었습니다."
        description={`요일: ${dayOfWeek}, 시간: ${date.toLocaleTimeString()}, 반복: ${repeat ? "예" : "아니오"}`}
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => {
          console.log("api request");
        }}
      />
    </View>
  );
};

export default AlarmBody;
