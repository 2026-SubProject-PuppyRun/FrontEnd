import { Text } from "@/components/ui/text";
import { Switch, View } from "react-native";

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
    <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5">
      <Text className="text-sm font-medium text-[#0D0F1B]">{alarmName}</Text>
      <Switch
        trackColor={{ false: "#E5E7EB", true: "#F25857" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
        value={isEnabled}
        onValueChange={onToggle}
      />
    </View>
  );
};

export default AlarmSetSwitch;
