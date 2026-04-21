import { Switch } from "react-native";
import { AccordionContentText } from "../ui/accordion";
import { HStack } from "../ui/hstack";

interface AlarmSetSwitchProps {
  alarmName: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const AlarmSetSwitch = ({
  alarmName,
  isEnabled,
  onToggle,
}: AlarmSetSwitchProps) => {
  return (
    <HStack className=" justify-between">
      <AccordionContentText className=" text-black">
        {alarmName}
      </AccordionContentText>
      <Switch
        trackColor={{ false: "#d4d4d4", true: "#525252" }}
        thumbColor="#fafafa"
        ios_backgroundColor="#d4d4d4"
        value={isEnabled}
        onValueChange={onToggle}
      />
    </HStack>
  );
};

export default AlarmSetSwitch;
