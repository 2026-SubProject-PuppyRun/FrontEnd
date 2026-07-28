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
    <Pressable
      onPress={() => router.push(`/care/pets/${petId}/diet`)}
      className="mb-3 flex-row items-center gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm"
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

      <View className="flex-1">
        <Text className="text-base font-bold text-[#0D0F1B]">{info.name}</Text>
        <Text className="mt-0.5 text-sm text-gray-500">{info.breedName}</Text>
        <Text className="mt-1 text-xs text-gray-400">
          {info.birthLabel} · {info.weightLabel}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
};

export default PetListBoardItem;
