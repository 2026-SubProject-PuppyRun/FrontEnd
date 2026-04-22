import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "react-native";

const UserBoard = () => {
  const router = useRouter();
  return (
    <View className="m-4 items-center justify-center gap-4 rounded-lg bg-gray-200 p-4">
      <Avatar size="xl">
        <AvatarImage source={{ uri: "https://i.ifh.cc/jgbhah.jpg" }} />
      </Avatar>
      <Text size="2xl" className="semi-bold text-black">
        마라토너
      </Text>
      <Progress className="h-2 w-full" size="sm" value={46}>
        <ProgressFilledTrack className="rounded-lg bg-primary-400" />
      </Progress>
      <Button
        size="lg"
        className=""
        onPress={() => router.push("/mypage/pets")}
      >
        <ButtonText>반려견 관리</ButtonText>
      </Button>
      
    </View>
  );
};

export default UserBoard;
