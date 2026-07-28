import PastureBoard from "@/components/board/PetBoard/PastureBoard";
import PetListBoard from "@/components/board/PetBoard/PetListBoard";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const CARE_ITEMS = [
  { icon: "restaurant-outline" as const, label: "식단" },
  { icon: "fitness-outline" as const, label: "체중" },
  { icon: "medkit-outline" as const, label: "백신" },
  { icon: "alert-circle-outline" as const, label: "알러지" },
];

const PetBody = () => {
  const router = useRouter();
  const petList = usePetStore((state) => state.petList);
  const petCount = petList?.length ?? 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-[#FFF0F0] p-3">
            <Ionicons name="heart" size={22} color="#F25857" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-[#0D0F1B]">
              {/*추후에 우리 -> 유저이름으로 변경*/}
              우리 아이들 {petCount}마리
            </Text>
            <Text className="mt-0.5 text-sm text-gray-500">
              식단·체중·백신·알러지 기록을 관리해보세요
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row justify-between">
          {CARE_ITEMS.map((item) => (
            <View key={item.label} className="items-center gap-1">
              <View className="rounded-2xl bg-[#F7F7F7] p-2.5">
                <Ionicons name={item.icon} size={18} color="#F25857" />
              </View>
              <Text className="text-[11px] font-medium text-gray-500">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <PastureBoard />

      {petCount > 0 && (
        <>
          <View className="mb-3 mt-1 flex-row items-end justify-between">
            <View>
              <Text className="text-base font-semibold text-[#0D0F1B]">
                반려견 목록
              </Text>
              <Text className="mt-0.5 text-sm text-gray-500">
                카드를 눌러 케어 기록을 확인하세요
              </Text>
            </View>
            <View className="rounded-full bg-[#FFF0F0] px-3 py-1">
              <Text className="text-xs font-semibold text-[#F25857]">
                {petCount}마리
              </Text>
            </View>
          </View>
          <PetListBoard />
        </>
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
              {petCount === 0 ? "첫 반려견 등록하기" : "반려견 추가하기"}
            </Text>
          </Pressable>
        </RedButtonSurface>
      </View>
    </ScrollView>
  );
};

export default PetBody;
