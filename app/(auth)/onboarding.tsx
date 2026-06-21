import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <View style={styles.logoArea}>
        <Image
          source={require("@/assets/images/main_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonArea}>
        <Text style={styles.subText}>Sign in to get started</Text>

        <Button
          variant="outline"
          action="primary"
          size="lg"
          className="w-full rounded-full border-[#D95F52]"
          onPress={() => router.push("/(auth)/login")}
        >
          <ButtonText className="text-[#D95F52]">
            Log in with Puppy Run ID
          </ButtonText>
        </Button>

        <Button
          variant="outline"
          action="secondary"
          size="lg"
          className="w-full rounded-full bg-white"
        >
          <ButtonText>🇬 Sign in with Google</ButtonText>
        </Button>

        <Button
          variant="outline"
          action="secondary"
          size="lg"
          className="w-full rounded-full bg-white"
        >
          <ButtonText> Sign in with Apple</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 180,
  },
  buttonArea: {
    width: "100%",
    paddingBottom: 60,
    gap: 12,
    alignItems: "center",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
});
