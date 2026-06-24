import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Signup() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const handleSignup = () => {
    if (!id || !pw || !pwConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // TODO: 백엔드 API 연동
    alert("백엔드 연동 후 완성 예정");
  };

  return (
    <View className="flex-1 bg-[#F5EFE8] px-7 pt-[60px]">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="mb-4 text-[22px] text-[#333]">←</Text>
      </TouchableOpacity>

      <Text className="mb-1 text-[32px] font-extrabold text-[#1A1A1A]">
        New Account
      </Text>
      <Text className="mb-7 text-[13px] text-[#888]">
        로그인을 위해 회원가입이 필요합니다.
      </Text>

      <View className="rounded-2xl bg-white p-6">
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
        <Input variant="underlined" size="md" className="mb-2">
          <InputField
            placeholder="Password"
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            className="text-black"
          />
        </Input>

        <Text className="mt-2 text-[13px] font-semibold text-[#333]">
          PW 확인
        </Text>
        <Input variant="underlined" size="md" className="mb-4">
          <InputField
            placeholder="Password"
            value={pwConfirm}
            onChangeText={setPwConfirm}
            secureTextEntry
            className="text-black"
          />
        </Input>

        <Button
          size="lg"
          action="primary"
          className="w-full rounded-full bg-[#D95F52]"
          onPress={handleSignup}
        >
          <ButtonText>회원가입</ButtonText>
        </Button>
      </View>
    </View>
  );
}
