import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { ShareIcon, Icon } from "@/components/ui/icon";
import { Pressable, Text, View } from "react-native";

interface VaccineAddFooterProps {
  onPressAdd: () => void;
  onPressShare: () => void;
}

const VaccineAddFooter = ({
  onPressAdd,
  onPressShare,
}: VaccineAddFooterProps) => (
  <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-gray-100 bg-white px-6 pb-12 pt-4">
    <View className="flex-row items-center gap-3">
      <View className="flex-1">
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
              접종 추가
            </Text>
          </Pressable>
        </RedButtonSurface>
      </View>

      <Pressable
        onPress={onPressShare}
        accessibilityRole="button"
        accessibilityLabel="접종 기록 공유"
        className="h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-[#F7F7F7] active:opacity-70"
      >
        <Icon as={ShareIcon} size="md" className="text-[#0D0F1B]" />
      </Pressable>
    </View>
  </View>
);

export default VaccineAddFooter;
