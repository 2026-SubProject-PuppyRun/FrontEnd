import { Pressable } from "@/components/ui/pressable";
import { Pet } from "@/store/usePetStore";
import { getBreedName } from "@/util/getBreedCode";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

type PetListBoardItemProps = Pick<
  Pet,
  "petId" | "name" | "breedCode" | "birthYear" | "profileImageUrl"
>;

const PetListBoardItem = ({
  profileImageUrl,
  name,
  petId,
  breedCode,
  birthYear,
}: PetListBoardItemProps) => {
  const petBreed = getBreedName(breedCode);
  const router = useRouter();
  const dateFormat = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  return (
    <Pressable
      className="m-2 flex-row items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-6 shadow-md"
      onPress={() => router.push(`/care/pets/${petId.toString()}`)}
    >
      <View className="h-32 w-32 overflow-hidden rounded-full">
        <Image
          source={{ uri: profileImageUrl || "" }}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "#f1f5f9",
          }}
          contentFit="fill"
          transition={200}
        />
      </View>
      <View className="flex-1 flex-col items-center justify-center ">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-sm text-gray-500">{petBreed}</Text>
        </View>
        <Text className="text-sm text-gray-500">
          {dateFormat(birthYear || "")}
        </Text>
      </View>
    </Pressable>
  );
};

export default PetListBoardItem;
