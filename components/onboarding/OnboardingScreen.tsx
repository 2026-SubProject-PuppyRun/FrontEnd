import OnboardingStepDots from "@/components/onboarding/OnboardingStepDots";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OnboardingScreenProps = {
  step: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  ctaLabel: string;
  onCtaPress: () => void;
  ctaLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  showBack?: boolean;
};

const OnboardingScreen = ({
  step,
  title,
  subtitle,
  children,
  ctaLabel,
  onCtaPress,
  ctaLoading = false,
  secondaryLabel,
  onSecondaryPress,
  showBack = true,
}: OnboardingScreenProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center px-4 pb-2 pt-1">
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
            >
              <Ionicons name="chevron-back" size={24} color="#0D0F1B" />
            </Pressable>
          ) : (
            <View className="h-10 w-10" />
          )}
          <View className="flex-1 items-center pl-4">
            <OnboardingStepDots current={step} />
          </View>
          <View className="h-10 w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mt-2 text-[28px] font-bold leading-9 text-[#0D0F1B]">
            {title}
          </Text>
          <Text className="mt-2.5 text-[15px] leading-6 text-gray-500">
            {subtitle}
          </Text>

          <View className="mt-6">{children}</View>
        </ScrollView>

        <View
          className=" bg-[#F7F7F7] px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          {secondaryLabel && onSecondaryPress ? (
            <Pressable
              onPress={onSecondaryPress}
              disabled={ctaLoading}
              className="mb-3 items-center py-2 active:opacity-70"
            >
              <Text className="text-sm font-medium text-gray-400">
                {secondaryLabel}
              </Text>
            </Pressable>
          ) : null}

          <RedButtonSurface
            borderRadius={30}
            backgroundColor="#F25857"
            shadowPadding={8}
            hostStyle={{ width: "100%" }}
            style={{ width: "100%", height: 56 }}
          >
            <Pressable
              onPress={onCtaPress}
              disabled={ctaLoading}
              className="h-full w-full items-center justify-center"
              style={({ pressed }) =>
                pressed && !ctaLoading ? { opacity: 0.85 } : undefined
              }
            >
              <Text className="text-base font-semibold text-white">
                {ctaLoading ? "등록 중..." : ctaLabel}
              </Text>
            </Pressable>
          </RedButtonSurface>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OnboardingScreen;
