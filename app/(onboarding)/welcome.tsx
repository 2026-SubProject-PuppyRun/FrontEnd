import OnboardingStepDots from "@/components/onboarding/OnboardingStepDots";
import WelcomeIconSvg from "@/components/svg/WelcomeIconSvg";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BRAND = "#F25857";
const TEXT_DARK = "#0D0F1B";

const FEATURES = [
  {
    icon: "navigate" as const,
    title: "산책 경로 자동 기록",
    description: "GPS로 걸은 길을 지도에 그려줍니다",
  },
  {
    icon: "speedometer" as const,
    title: "거리·페이스 실시간 확인",
    description: "달리는 동안 페이스를 바로 보여줍니다",
  },
  {
    icon: "heart" as const,
    title: "접종·알러지 건강 관리",
    description: "우리 아이 건강 기록을 한곳에 모아요",
  },
];

const FeatureRow = ({
  icon,
  title,
  description,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
}) => (
  <View className="flex-row items-center gap-4">
    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EF]">
      <Ionicons name={icon} size={20} color={BRAND} />
    </View>
    <View className="flex-1">
      <Text className="text-[15px] font-semibold text-[#0D0F1B]">{title}</Text>
      <Text className="mt-0.5 text-[13px] leading-[18px] text-gray-500">
        {description}
      </Text>
    </View>
  </View>
);

const Welcome = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#FFF1F0", "#FFFAF9", "#F7F7F7"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-[#F25857]/[0.07]"
      />
      <View
        pointerEvents="none"
        className="absolute -left-10 top-40 h-44 w-44 rounded-full bg-[#7EB2FE]/10"
      />

      <View
        className="flex-1 px-7"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.heroSection}
        >
          <View className="h-[260px] w-[260px] items-center justify-center rounded-full bg-[#F25857]/[0.06]">
            <View className="h-[200px] w-[200px] items-center justify-center rounded-full bg-white/60">
              <WelcomeIconSvg width={168} height={109} />
            </View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(500)}
            style={styles.headingBlock}
          >
            <Text className="text-center text-[15px] font-semibold text-[#F25857]">
              반가워요!
            </Text>
            <Text
              className="mt-2 text-center text-[28px] font-bold leading-9"
              style={{ color: TEXT_DARK }}
            >
              퍼피런에 오신 것을{"\n"}환영합니다
            </Text>
            <Text className="mt-3 text-center text-[15px] leading-6 text-gray-500">
              우리 아이와의 산책을 기록하고{"\n"}건강까지 함께 관리해 보세요
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View
            className="gap-4 rounded-3xl bg-white/80 px-5 py-5"
            style={styles.featureCard}
          >
            {FEATURES.map((feature) => (
              <FeatureRow key={feature.title} {...feature} />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(450).duration(500)}
          style={styles.footer}
        >
          <Text className="mb-5 text-center text-[13px] text-gray-400">
            먼저 반려견 정보를 등록해 주세요
          </Text>

          <RedButtonSurface
            borderRadius={30}
            backgroundColor={BRAND}
            shadowPadding={8}
            hostStyle={{ width: "100%" }}
            style={{ width: "100%", height: 56 }}
          >
            <Pressable
              onPress={() => router.push("/(onboarding)/basics")}
              className="h-full w-full flex-row items-center justify-center gap-2"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-base font-semibold text-white">
                시작하기
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
          </RedButtonSurface>

          <View className="mt-6">
            <OnboardingStepDots current={0} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headingBlock: {
    marginTop: 8,
  },
  featureCard: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "rgba(242, 88, 87, 0.08)",
  },
  footer: {
    marginTop: 28,
  },
});

export default Welcome;
