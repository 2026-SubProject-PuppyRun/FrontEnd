import PetForm from "@/components/form/PetForm";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";

const Create = () => {
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
          <Text className="text-lg font-bold text-[#0D0F1B]">반려견 추가</Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm
          onSubmit={(data) => {
            console.log("반려견 추가 전송", data);
            // TODO: 반려견 추가 전송 이후 API 재요청하여 반려견 목록 업데이트
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Create;
