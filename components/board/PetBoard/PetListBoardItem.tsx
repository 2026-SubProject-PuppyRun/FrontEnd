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
  | "petId"
  | "name"
  | "breedCode"
  | "birthYear"
  | "profileImageUrl"
  | "mbti"
  | "color"
  | "weight"
  | "gender"
  | "isNeutered"
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
      <Pressable
        onPress={() => router.push(`/care/pets/${petId}/diet`)}
        className="flex-row items-center gap-4"
        style={({ pressed }) => (pressed ? { opacity: 0.92 } : undefined)}
      >
        <View
          className="h-16 w-16 overflow-hidden rounded-full border-[3px] bg-[#F1F5F9]"
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
              <Ionicons name="paw" size={24} color="#fff" />
            </View>
          )}
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-base font-bold text-[#0D0F1B]">{info.name}</Text>
            {mbti ? (
              <View className="rounded-full bg-[#FFF8E1] px-2.5 py-0.5">
                <Text className="text-xs font-bold text-[#D97706]">{mbti}</Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-0.5 text-sm text-gray-500">{info.breedName}</Text>
          <View className="mt-2 flex-row flex-wrap gap-1.5">
            <View className="rounded-full bg-[#F7F7F7] px-2.5 py-0.5">
              <Text className="text-xs text-gray-500">{info.genderLabel}</Text>
            </View>
            <View className="rounded-full bg-[#F7F7F7] px-2.5 py-0.5">
              <Text className="text-xs text-gray-500">{info.weightLabel}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      <View className="mt-3 flex-row gap-2 border-t border-[#F7F7F7] pt-3">
        {(["diet", "weight", "vaccine", "allergy"] as const).map((tab) => {
          const labels = {
            diet: "식단",
            weight: "체중",
            vaccine: "백신",
            allergy: "알러지",
          };
          return (
            <Pressable
              key={tab}
              onPress={() => router.push(`/care/pets/${petId}/${tab}`)}
              className="flex-1 items-center rounded-xl bg-[#F7F7F7] py-2"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-xs font-semibold text-[#0D0F1B]">
                {labels[tab]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default PetListBoardItem;
