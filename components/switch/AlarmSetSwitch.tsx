import { Text } from "@/components/ui/text";
import { Switch, View } from "react-native";

interface AlarmSetSwitchProps {
  alarmName: string;
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  description?: string;
}

const AlarmSetSwitch = ({
  alarmName,
  isEnabled,
  onToggle,
  disabled = false,
  description,
}: AlarmSetSwitchProps) => {
  return (
    <View
      className={`flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="mr-3 flex-1">
        <Text className="text-sm font-medium text-[#0D0F1B]">{alarmName}</Text>
        {description ? (
          <Text className="mt-0.5 text-xs text-gray-500">{description}</Text>
        ) : null}
      </View>
      <Switch
        trackColor={{ false: "#E5E7EB", true: "#F25857" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
        value={isEnabled}
        onValueChange={onToggle}
        disabled={disabled}
      />
    </View>
  );
};

export default AlarmSetSwitch;
