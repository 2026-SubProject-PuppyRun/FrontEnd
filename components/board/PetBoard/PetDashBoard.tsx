import { Pet } from "@/store/usePetStore";
import { getPetBasicInfo } from "@/util/pet";
import { Image } from "expo-image";
import { Text, View } from "react-native";

interface PetDashBoardProps {
  pet: Pet;
}

const MetaDivider = () => <Text className="px-1 text-sm text-gray-300">/</Text>;

const PetDashBoard = ({ pet }: PetDashBoardProps) => {
  const info = getPetBasicInfo(pet);

  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm">
      <View className="flex-row items-center gap-4">
        <View
          className="h-[72px] w-[72px] overflow-hidden rounded-full border-[3px] bg-white"
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
            />
          )}
        </View>

        <View className="flex-1 justify-center">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-lg font-bold text-[#0D0F1B]">{info.name}</Text>
            {pet.mbti ? (
              <View className="rounded-full bg-[#FFF8E1] px-2.5 py-0.5">
                <Text className="text-xs font-bold text-[#D97706]">
                  {pet.mbti}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-1 text-sm text-gray-500">{info.birthLabel}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap items-center justify-center">
        <Text className="text-sm text-gray-600">{info.breedName}</Text>
        <MetaDivider />
        <Text className="text-sm text-gray-600">{info.genderLabel}</Text>
        <MetaDivider />
        <Text className="text-sm text-gray-600">{info.neuteredLabel}</Text>
        <MetaDivider />
        <Text className="text-sm text-gray-600">{info.weightLabel}</Text>
      </View>
    </View>
  );
};

export default PetDashBoard;
