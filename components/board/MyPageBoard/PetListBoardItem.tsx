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
  mbti?: string;
}

const PetListBoardItem = ({
  petImgUrl,
  petName,
  petId,
  mbti,
}: PetListBoardItemProps) => {
  const router = useRouter();
  return (
    <View className="min-h-24 rounded-lg bg-gray-300 p-4">
      <HStack className=" items-center ">
        <Avatar size="xl">
          <AvatarImage source={{ uri: petImgUrl }} />
        </Avatar>
        <View className="flex-1 items-start pl-4">
          <HStack className="items-center space-x-2">
            <Text size="2xl" className="font-bold text-black">
              {petName}
            </Text>
            {mbti && (
              <Pressable
                onPress={() => {
                  /* 멍BTI 모달 열기 */
                }}
              >
                <View className="rounded-full bg-yellow-100 px-2 py-1">
                  <Text className="text-xs font-bold text-yellow-600">
                    {mbti}
                  </Text>
                </View>
              </Pressable>
            )}
          </HStack>
          {!mbti && (
            <Pressable
              className="mt-1"
              onPress={() => router.push(`/mypage/pets/${petId}/mbti`)}
            >
              <Text className=" text-gray-500 underline " size="sm">
                우리 아이 멍BTI는? 🐾
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable
          className=" h-full items-end"
          onPress={() => {
            router.push(`/mypage/pets/${petId}/edit`);
          }}
        >
          <Text className="text-blue-500">수정</Text>
        </Pressable>
      </HStack>
    </View>
  );
};

export default PetListBoardItem;
