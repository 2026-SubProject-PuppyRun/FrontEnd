import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "react-native";

interface PetListBoardItemProps {
  petImgUrl: string;
  petName: string;
  petId: string;
}

const PetListBoardItem = ({
  petImgUrl,
  petName,
  petId,
}: PetListBoardItemProps) => {
  const router = useRouter();
  return (
    <View className="min-h-24 rounded-lg bg-gray-300 p-4">
      <HStack className=" items-center ">
        <Avatar size="xl">
          <AvatarImage source={{ uri: petImgUrl }} />
        </Avatar>
        <View className="flex-1 items-center">
          <Text size="2xl" className="font-bold text-black">
            {petName}
          </Text>
        </View>
        <Pressable
          className=" h-full items-end"
          onPress={() => {
            router.push(`/mypage/pets/${petId}`);
          }}
        >
          <Text className="text-blue-500">수정</Text>
        </Pressable>
      </HStack>
    </View>
  );
};

export default PetListBoardItem;
