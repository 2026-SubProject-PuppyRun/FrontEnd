import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <View className="flex-1 bg-[#F5EFE8] px-7 pt-[60px]">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="mb-4 text-[22px] text-[#333]">←</Text>
      </TouchableOpacity>

      <Text className="mb-1 text-[32px] font-extrabold text-[#1A1A1A]">
        Login
      </Text>
      <Text className="mb-7 text-[13px] text-[#888]">
        앱을 사용하려면 로그인이 필요합니다.
      </Text>

      <View className="mb-5 rounded-2xl bg-white p-6">
        <Text className="mt-2 text-[13px] font-semibold text-[#333]">ID</Text>
        <Input variant="underlined" size="md" className="mb-2">
          <InputField
            placeholder="E-mail or Phone Number"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            className="text-black"
          />
        </Input>

        <Text className="mt-2 text-[13px] font-semibold text-[#333]">PW</Text>
        <Input variant="underlined" size="md" className="mb-4">
          <InputField
            placeholder="Password"
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            className="text-black"
          />
        </Input>

        <Button
          size="lg"
          action="primary"
          className="w-full rounded-full bg-[#D95F52]"
          onPress={() => router.replace("/(tabs)/home")} // 초기화면에서 로컬 로그인 들어가서 login 버튼 누르면 일단 홈 페이지로 넘어가게 해둠.
        >
          <ButtonText>Login</ButtonText>
        </Button>
      </View>

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text className="text-center text-[13px] text-[#D95F52]">
          계정이 없으신가요? 회원가입
        </Text>
      </TouchableOpacity>
    </View>
  );
}
