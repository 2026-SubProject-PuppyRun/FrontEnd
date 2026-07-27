import PetBody from "@/components/body/pet/PetBody";
import RunLogoSvg from "@/components/svg/RunLogoSvg";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <View className="flex-row items-center px-6 pb-2 pt-3">
        <View className="h-10 w-10" />
        <View className="flex-1 items-center">
          <RunLogoSvg width={160} height={42} />
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

      <View className="px-6 pb-2">
        <Text className="text-xl font-bold text-[#0D0F1B]">우리 아이들</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          목장에서 뛰어놀고, 건강 기록도 챙겨요
        </Text>
      </View>

      <PetBody />
    </View>
  );
};

export default Index;
