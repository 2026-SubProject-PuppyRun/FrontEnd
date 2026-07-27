import AlarmBody from "@/components/body/AlarmBody";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";

const Alarm = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <View className="flex-row items-center px-6 pb-2 pt-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
        >
          <Ionicons name="chevron-back" size={28} color="#0D0F1B" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-[#0D0F1B]">알람 설정</Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-3">
        <Text className="text-sm text-gray-500">
          산책·급여 시간을 알려드릴게요
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <AlarmBody />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Alarm;
