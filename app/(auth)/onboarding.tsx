import { Button, ButtonText } from "@/components/ui/button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// 백엔드 로그인 API 호출
const signInToServer = async (email: string, idToken: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: idToken }),
  });

  if (!response.ok) throw new Error("로그인 실패");
  return response.json(); // { access_token, refresh_token }
};

export default function Onboarding() {
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  // 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      const email = userInfo.data?.user.email;

      if (!idToken || !email) throw new Error("구글 로그인 정보 없음");

      const { access_token, refresh_token } = await signInToServer(
        email,
        idToken,
      );

      console.log("로그인 성공!", access_token);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      Alert.alert("로그인 실패", "구글 로그인에 실패했습니다.");
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      const idToken = token.idToken;

      // 카카오 사용자 이메일 가져오기
      const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });
      const profile = await profileRes.json();
      const email = profile.kakao_account?.email;

      if (!idToken || !email) throw new Error("카카오 로그인 정보 없음");

      const { access_token, refresh_token } = await signInToServer(
        email,
        idToken,
      );

      console.log("로그인 성공!", access_token);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      Alert.alert("로그인 실패", "카카오 로그인에 실패했습니다.");
    }
  };

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
        <Text className="mb-2 text-sm text-[#888]">Sign in to get started</Text>

        <Button
          variant="outline"
          action="secondary"
          size="lg"
          className="w-full rounded-full bg-white"
          onPress={handleGoogleLogin}
        >
          <ButtonText>🇬 Sign in with Google</ButtonText>
        </Button>

        <Button
          variant="outline"
          action="secondary"
          size="lg"
          className="w-full rounded-full bg-[#FEE500]"
          onPress={handleKakaoLogin}
        >
          <ButtonText className="text-black">카카오로 로그인</ButtonText>
        </Button>
      </View>
    </View>
  );
}
