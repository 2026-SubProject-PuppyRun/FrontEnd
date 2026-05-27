import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface AllergyAddFooterProps {
  onPressAdd: () => void;
  onPressShare: () => void;
}

const AllergyAddFooter = ({ onPressAdd, onPressShare }: AllergyAddFooterProps) => (
  <View className="border-t border-gray-100 px-4 py-3">
    <HStack className="items-center gap-2">
      <Button
        onPress={onPressAdd}
        className="min-h-12 flex-1 rounded-2xl bg-primary-500"
      >
        <ButtonText>알러지 추가</ButtonText>
      </Button>
      <Pressable
        onPress={onPressShare}
        accessibilityRole="button"
        accessibilityLabel="알러지 기록 공유"
        className="h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white active:opacity-70"
      >
        <Ionicons name="share-outline" size={22} color="#0D0F1B" />
      </Pressable>
    </HStack>
  </View>
);

export default AllergyAddFooter;
