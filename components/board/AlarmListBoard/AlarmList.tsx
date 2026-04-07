import { ScrollView } from "react-native";
import AlarmListItem from "./AlarmListItem";

interface AlarmItem {
  title: string;
  dayOfWeek: string;
  time: string;
}
interface AlarmListProps {
  alarmList: AlarmItem[];
}
const AlarmList = ({ alarmList }: AlarmListProps) => {
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
          />
        ))}
    </ScrollView>
  );
};

export default AlarmList;
