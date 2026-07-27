import PastureBoard from "@/components/board/PetBoard/PastureBoard";
import PetListBoard from "@/components/board/PetBoard/PetListBoard";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const PetBody = () => {
  const router = useRouter();
  const petList = usePetStore((state) => state.petList);
  const petCount = petList?.length ?? 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <PastureBoard />

      <View className="mb-3 mt-1">
        <Text className="text-base font-semibold text-[#0D0F1B]">
          반려견 목록
        </Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          카드를 눌러 식단·체중·백신 기록을 확인하세요
        </Text>
      </View>

      {petCount === 0 ? (
        <View className="items-center rounded-3xl bg-white px-6 py-10 shadow-sm">
          <View className="mb-4 rounded-full bg-[#F7F7F7] p-5">
            <Ionicons name="paw-outline" size={36} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-[#0D0F1B]">
            등록된 반려견이 없어요
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            펫을 추가하면 목장에서 함께 뛰어놀 수 있어요
          </Text>
        </View>
      ) : (
        <PetListBoard />
      )}

      <View className="mt-5">
        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 56 }}
        >
          <Pressable
            onPress={() => router.push("/mypage/pets/create")}
            className="h-full w-full flex-row items-center justify-center gap-2"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text className="text-base font-semibold text-white">
              반려견 추가하기
            </Text>
          </Pressable>
        </RedButtonSurface>
      </View>
    </ScrollView>
  );
};

export default PetBody;
