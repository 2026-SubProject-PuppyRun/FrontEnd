import PetListBoard from "@/components/board/MyPageBoard/PetListBoard";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PetBody = () => {
  const router = useRouter();
  const petList = usePetStore((state) => state.petList);
  const petCount = petList?.length ?? 0;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 pt-4"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 96 + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-5 rounded-3xl bg-white px-5 py-5 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-[#FFF0F0] p-3">
            <Ionicons name="paw" size={22} color="#F25857" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-[#0D0F1B]">
              등록된 반려견 {petCount}마리
            </Text>
            <Text className="mt-0.5 text-sm text-gray-500">
              프로필을 수정하거나 케어 기록을 확인해보세요
            </Text>
          </View>
        </View>
      </View>

      {petCount === 0 ? (
        <View className="items-center rounded-3xl bg-white px-6 py-12 shadow-sm">
          <View className="mb-4 rounded-full bg-[#F7F7F7] p-5">
            <Ionicons name="paw-outline" size={36} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-[#0D0F1B]">
            아직 등록된 반려견이 없어요
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            우리 아이를 등록하고 산책·건강 기록을 관리해보세요
          </Text>
        </View>
      ) : (
        <PetListBoard />
      )}

      <View className="mt-6">
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
