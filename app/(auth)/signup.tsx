import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>New Account</Text>
      <Text style={styles.subtitle}>로그인을 위해 회원가입이 필요합니다.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID</Text>
        <Input variant="underlined" size="md" className="mb-2">
          <InputField
            placeholder="E-mail or Phone Number"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            className="text-black"
          />
        </Input>

        <Text style={styles.label}>PW</Text>
        <Input variant="underlined" size="md" className="mb-2">
          <InputField
            placeholder="Password"
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            className="text-black"
          />
        </Input>

        <Text style={styles.label}>PW 확인</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE8",
    paddingHorizontal: 28,
    paddingTop: 60,
  },
  back: { fontSize: 22, color: "#333", marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "800", color: "#1A1A1A", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 28 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 8 },
});
