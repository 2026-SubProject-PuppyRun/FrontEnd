import MbtiBody from "@/components/body/mypage/MbtiBody";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Mbti = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === id),
  );
  const petName = pet?.name ?? "우리 아이";

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
          <Text className="text-lg font-bold text-[#0D0F1B]">멍BTI 검사</Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-3">
        <Text className="text-center text-sm text-gray-500">
          {petName}의 성격을 알아볼까요?
        </Text>
      </View>

      <MbtiBody petId={id} petName={petName} />
    </View>
  );
};

export default Mbti;
