import PetForm from "@/components/form/PetForm";
import { Text } from "@/components/ui/text";
import { Pet, usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";

const Edit = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === id),
  ) as Pet;

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
          <Text className="text-lg font-bold text-[#0D0F1B]">
            반려견 정보 수정
          </Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm
          initialData={pet}
          onSubmit={(data) => {
            console.log("수정된 반려견 정보:", data);
            // TODO: 수정된 반려견 정보를 서버에 저장하는 로직 추가
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Edit;
