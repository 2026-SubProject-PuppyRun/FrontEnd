import { Button, ButtonText } from "@/components/ui/button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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
      await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;

      if (!accessToken) throw new Error("ACCESS_TOKEN_MISSING");

      const response = await fetch(`${BASE_URL}/api/oauth2/google/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_access_token: accessToken }),
      });

      const data = await response.json();

      if (response.status === 400) {
        // 지원하지 않는 제공자 또는 인가코드 누락
        console.error("400 에러:", data.message);
        Alert.alert("로그인 실패", data.message ?? "잘못된 요청입니다.");
        return;
      }

      if (response.status === 401) {
        // 유효하지 않은 인가 코드
        console.error("401 에러:", data.message);
        Alert.alert(
          "로그인 실패",
          data.message ?? "google 액세스 토큰이 유효하지 않습니다.",
        );
        return;
      }

      if (!response.ok) {
        Alert.alert("로그인 실패", "알 수 없는 오류가 발생했습니다.");
        return;
      }

      const { access_token, refresh_token } = data;
      console.log("구글 로그인 성공!", access_token);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      Alert.alert("로그인 실패", "구글 로그인 중 오류가 발생했습니다.");
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      const accessToken = token.accessToken;

      if (!accessToken) throw new Error("ACCESS_TOKEN_MISSING");

      const response = await fetch(`${BASE_URL}/api/oauth2/kakao/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_access_token: accessToken }),
      });

      const data = await response.json();

      if (response.status === 400) {
        console.error("400 에러:", data.message);
        Alert.alert("로그인 실패", data.message ?? "잘못된 요청입니다.");
        return;
      }

      if (response.status === 401) {
        console.error("401 에러:", data.message);
        Alert.alert(
          "로그인 실패",
          data.message ?? "카카오 액세스 토큰이 유효하지 않습니다.",
        );
        return;
      }

      if (!response.ok) {
        Alert.alert("로그인 실패", "알 수 없는 오류가 발생했습니다.");
        return;
      }

      const { access_token, refresh_token } = data;
      console.log("카카오 로그인 성공!", access_token);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      Alert.alert("로그인 실패", "카카오 로그인 중 오류가 발생했습니다.");
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
