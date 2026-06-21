import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>앱을 사용하려면 로그인이 필요합니다.</Text>

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
        <Text style={styles.signupLink}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 8 },
  signupLink: { textAlign: "center", color: "#D95F52", fontSize: 13 },
});
