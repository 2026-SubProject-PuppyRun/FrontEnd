import { AlarmItem } from "@/components/body/AlarmBody";
import { ScrollView } from "react-native";
import AlarmListItem from "./AlarmListItem";

interface AlarmListProps {
  alarmList: AlarmItem[];
  setAlarmList: React.Dispatch<React.SetStateAction<AlarmItem[]>>;
}
const AlarmList = ({ alarmList, setAlarmList }: AlarmListProps) => {
  console.log(alarmList);
  return (
    <ScrollView className="mt-4">
      {alarmList.length > 0 &&
        alarmList.map((item, index) => (
          <AlarmListItem
            key={index}
            title={item.title}
            dayOfWeek={item.dayOfWeek}
            time={item.time}
            onDelete={() => {
              setAlarmList((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
    </ScrollView>
  );
};

export default AlarmList;
