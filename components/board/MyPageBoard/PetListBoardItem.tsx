import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Pet } from "@/store/usePetStore";
import { getPetBasicInfo } from "@/util/pet";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";

type PetListBoardItemProps = Pick<
  Pet,
  "petId" | "name" | "breedCode" | "birthYear" | "profileImageUrl" | "mbti" | "color" | "weight" | "gender" | "isNeutered"
>;

const PetListBoardItem = ({
  profileImageUrl,
  name,
  petId,
  breedCode,
  birthYear,
  mbti,
  color,
  weight,
  gender,
  isNeutered,
}: PetListBoardItemProps) => {
  const router = useRouter();
  const info = getPetBasicInfo({
    petId,
    name,
    breedCode,
    birthYear,
    profileImageUrl,
    color,
    weight,
    gender,
    isNeutered,
    badgeCode: "",
  });

  return (
    <View className="mb-3 rounded-3xl bg-white px-5 py-4 shadow-sm">
      <View className="flex-row items-center gap-4">
        <View
          className="h-[72px] w-[72px] overflow-hidden rounded-full border-[3px] bg-[#F1F5F9]"
          style={{ borderColor: info.color }}
        >
          {info.profileImageUrl ? (
            <Image
              source={{ uri: info.profileImageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              className="h-full w-full items-center justify-center"
              style={{ backgroundColor: info.color }}
            >
              <Ionicons name="paw" size={28} color="#fff" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-lg font-bold text-[#0D0F1B]">{info.name}</Text>
            {mbti ? (
              <Pressable
                onPress={() => router.push(`/mypage/pets/${petId}/mbti`)}
                accessibilityRole="button"
                accessibilityLabel={`${name} 멍BTI 결과 보기`}
                className="rounded-full bg-[#FFF8E1] px-2.5 py-0.5"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
              >
                <Text className="text-xs font-bold text-[#D97706]">{mbti}</Text>
              </Pressable>
            ) : null}
          </View>
          <Text className="mt-0.5 text-sm text-gray-500">{info.breedName}</Text>
          <Text className="mt-1 text-xs text-gray-400">
            {info.birthLabel} · {info.genderLabel} · {info.weightLabel}
          </Text>
        </View>
      </View>

      {!mbti && (
        <Pressable
          className="mt-3 self-start"
          onPress={() => router.push(`/mypage/pets/${petId}/mbti`)}
        >
          <Text className="text-sm font-medium text-[#F25857]">
            우리 아이 멍BTI는? 🐾
          </Text>
        </Pressable>
      )}

      <View className="mt-4 flex-row gap-2">
        <Pressable
          onPress={() => router.push(`/care/pets/${petId}/medication`)}
          className="flex-1 items-center justify-center rounded-2xl bg-[#F7F7F7] py-3"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Text className="text-sm font-semibold text-[#0D0F1B]">케어 보기</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/mypage/pets/${petId}/edit`)}
          className="flex-1 items-center justify-center rounded-2xl border border-[#F25857] py-3"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Text className="text-sm font-semibold text-[#F25857]">프로필 수정</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PetListBoardItem;
