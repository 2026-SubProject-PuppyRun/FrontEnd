import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Pressable, Text, View } from "react-native";

interface WeightAddFooterProps {
  onPressAdd: () => void;
}

const WeightAddFooter = ({ onPressAdd }: WeightAddFooterProps) => (
  <View className="absolute bottom-0 left-0 right-0 rounded-3xl border-t border-gray-100 bg-white px-6 pb-12 pt-4">
    <RedButtonSurface
      borderRadius={30}
      backgroundColor="#F25857"
      shadowPadding={8}
      hostStyle={{ width: "100%" }}
      style={{ width: "100%", height: 52 }}
    >
      <Pressable
        onPress={onPressAdd}
        className="h-full w-full items-center justify-center"
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      >
        <Text className="text-base font-semibold text-white">
          체중 기록 추가
        </Text>
      </Pressable>
    </RedButtonSurface>
  </View>
);

export default WeightAddFooter;
