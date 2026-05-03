import { Text } from "@/components/ui/text";
import { mbtiResultData } from "@/constants/mbtiResultData";
import { Image } from "expo-image";
import { Dimensions, View } from "react-native";

interface MbtiResultCardProps {
  resultMbti: string;
}
const mbtiImages: Record<string, any> = {
  ESTJ: require("@/assets/images/mbti/ESTJ.png"),
  ESTP: require("@/assets/images/mbti/ESTP.png"),
  ESFJ: require("@/assets/images/mbti/ESFJ.png"),
  ESFP: require("@/assets/images/mbti/ESFP.png"),
  //   ENTJ: require("@/assets/images/mbti/ENTJ.png"),
  ENTP: require("@/assets/images/mbti/ENTP.png"),
  ENFJ: require("@/assets/images/mbti/ENFJ.png"),
  ENFP: require("@/assets/images/mbti/ENFP.png"),
  ISTJ: require("@/assets/images/mbti/ISTJ.png"),
  ISTP: require("@/assets/images/mbti/ISTP.png"),
  ISFJ: require("@/assets/images/mbti/ISFJ.png"),
  ISFP: require("@/assets/images/mbti/ISFP.png"),
  INTJ: require("@/assets/images/mbti/INTJ.png"),
  INTP: require("@/assets/images/mbti/INTP.png"),
  INFJ: require("@/assets/images/mbti/INFJ.png"),
  INFP: require("@/assets/images/mbti/INFP.png"),
};
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH * 0.8;

const MbtiResultCard = ({ resultMbti }: MbtiResultCardProps) => {
  const mbtiImage = mbtiImages[resultMbti] || mbtiImages.ENFP;
  const resultInfo = mbtiResultData[resultMbti];

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="mb-6 text-2xl font-bold text-gray-800">
        멍BTI 검사 결과
      </Text>

      <View
        className="mb-6 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-lg"
        style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
      >
        <Image
          source={mbtiImage}
          contentFit="cover"
          transition={500}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View className="mt-2 rounded-full bg-yellow-100 px-6 py-2 shadow-sm">
        <Text className="text-xl font-bold tracking-widest text-yellow-800">
          {resultInfo.mbti}
        </Text>
      </View>

      <Text className="mt-4 text-center text-xl font-extrabold text-black">
        {resultInfo.title}
      </Text>

      <Text className="mt-4 text-center text-base leading-6 text-gray-600">
        {resultInfo.description}
      </Text>

      <View className="mt-4 flex-row gap-2">
        {resultInfo.tags.map((tag) => (
          <View key={tag} className="rounded-full bg-gray-200 px-3 py-1">
            <Text className="text-sm text-gray-700">{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MbtiResultCard;
