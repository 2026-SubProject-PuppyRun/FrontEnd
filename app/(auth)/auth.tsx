import {
  GoogleLoginButton,
  KakaoLoginButton,
} from "@/components/auth";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { Image, Text, View } from "react-native";

export default function Auth() {
  const { signInWithGoogle, signInWithKakao } = useSocialAuth();

  return (
    <View className="flex-1 items-center justify-center bg-[#F5EFE8] px-8">
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/main_logo.png")}
          className="h-[180px] w-[220px]"
          resizeMode="contain"
        />
      </View>

      <View className="w-full items-center gap-3 pb-[60px]">
        <Text className="mb-2 text-sm text-[#888]">
          회원가입을 통해 퍼피런을 이용해보세요!
        </Text>

        <GoogleLoginButton onPress={signInWithGoogle} />
        <KakaoLoginButton onPress={signInWithKakao} />
      </View>
    </View>
  );
}
