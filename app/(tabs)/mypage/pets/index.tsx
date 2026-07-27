import PetBody from "@/components/body/mypage/PetBody";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Index = () => {
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
          <Text className="text-lg font-bold text-[#0D0F1B]">반려견 관리</Text>
        </View>
        <Pressable
          onPress={() => router.push("/mypage/pets/create")}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          accessibilityRole="button"
          accessibilityLabel="반려견 추가"
        >
          <Ionicons name="add" size={26} color="#0D0F1B" />
        </Pressable>
      </View>
      <PetBody />
    </View>
  );
};

export default Index;
