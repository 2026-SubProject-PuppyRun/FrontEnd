import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useUserStore } from "@/store/useUserStore";
import { View } from "react-native";

const MyPageProfileCard = () => {
  const nickName = useUserStore((state) => state.nickName);
  const displayName = nickName?.trim() || "퍼피러너";

  return (
    <View className="mx-2 mb-4 mt-2 flex-row items-center gap-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
      <Avatar size="xl" className="border-2 border-primary-100">
        <AvatarFallbackText>{displayName.slice(0, 1)}</AvatarFallbackText>
        <AvatarImage source={{ uri: "https://i.ifh.cc/jgbhah.jpg" }} />
      </Avatar>
      <View className="flex-1">
        <Text className="text-2xl font-bold text-[#0D0F1B]">{displayName}</Text>
        <Text className="mt-1 text-sm text-gray-500">
          오늘도 즐거운 산책 되세요 🐾
        </Text>
      </View>
    </View>
  );
};

export default MyPageProfileCard;
