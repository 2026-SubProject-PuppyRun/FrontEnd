import { Text } from "@/components/ui/text";
import {
  getHighestWalkGradeCode,
  getWalkGradeBadge,
} from "@/constants/walkGrade";
import { usePetStore } from "@/store/usePetStore";
import { useUserStore } from "@/store/useUserStore";
import { usePetProgressQuery } from "@/util/api/pets";
import { Image, View } from "react-native";

const BADGE_SIZE = 96;

const MyPageProfileCard = () => {
  const nickName = useUserStore((state) => state.nickName);
  const displayName = nickName?.trim() || "퍼피러너";
  const hasPets = (usePetStore((state) => state.petList)?.length ?? 0) > 0;

  const { data: progresses = [] } = usePetProgressQuery({
    enabled: hasPets,
  });

  const badgeSource = getWalkGradeBadge(getHighestWalkGradeCode(progresses));

  return (
    <View className="mx-2 mb-4 mt-2 flex-row items-center gap-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
      <Image
        source={badgeSource}
        style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
        resizeMode="contain"
        resizeMethod="resize"
        accessibilityLabel="산책 등급 뱃지"
      />
      <View className="flex-1">
        <Text className="text-2xl font-bold text-[#0D0F1B]">{displayName}</Text>
        <Text className="mt-1 text-sm text-gray-500">
          오늘도 즐거운 산책 되세요
        </Text>
      </View>
    </View>
  );
};

export default MyPageProfileCard;
