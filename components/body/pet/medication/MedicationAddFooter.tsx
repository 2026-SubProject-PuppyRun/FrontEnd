import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";

interface MedicationAddFooterProps {
  onPressAdd: () => void;
  disabled?: boolean;
}

const MedicationAddFooter = ({
  onPressAdd,
  disabled = false,
}: MedicationAddFooterProps) => (
  <View className="px-1 pb-12 pt-2">
    <RedButtonSurface
      borderRadius={30}
      backgroundColor="#F25857"
      shadowPadding={8}
      hostStyle={{ width: "100%" }}
      style={{ width: "100%", height: 52, opacity: disabled ? 0.6 : 1 }}
    >
      <Pressable
        onPress={onPressAdd}
        disabled={disabled}
        className="h-full w-full items-center justify-center"
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      >
        <Text className="text-base font-semibold text-white">
          + 투약 일정 추가
        </Text>
      </Pressable>
    </RedButtonSurface>
  </View>
);

export default MedicationAddFooter;
