import RunLogoSvg from "@/components/svg/RunLogoSvg";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

interface HeaderProps {
  /** 중앙 타이틀 텍스트 */
  title?: string;
  /** 헤더 아래 보조 설명 */
  subtitle?: string;
  /** 서브타이틀 정렬 (기본 left) */
  subtitleAlign?: "left" | "center";
  /** 중앙에 Run 로고 표시 */
  showLogo?: boolean;
  logoWidth?: number;
  logoHeight?: number;
  /** 중앙 영역 커스텀 노드 (title/logo보다 우선) */
  center?: React.ReactNode;
  /** 뒤로가기 숨김 */
  disableBack?: boolean;
  /** 뒤로가기 커스텀 핸들러 */
  onBackPress?: () => void;
  /** 우측 액션 영역 */
  right?: React.ReactNode;
  /** @deprecated right 사용 권장 — 하위 호환용 */
  children?: React.ReactNode;
  className?: string;
}

const Header = ({
  title,
  subtitle,
  subtitleAlign = "left",
  showLogo = false,
  logoWidth = 160,
  logoHeight = 42,
  center,
  disableBack = false,
  onBackPress,
  right,
  children,
  className,
}: HeaderProps) => {
  const router = useRouter();
  const rightContent = right ?? children;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    router.back();
  };

  const centerContent =
    center ??
    (showLogo ? (
      <RunLogoSvg width={logoWidth} height={logoHeight} />
    ) : title ? (
      <Text
        className="text-lg font-bold text-[#0D0F1B]"
        numberOfLines={1}
      >
        {title}
      </Text>
    ) : null);

  return (
    <View className={className}>
      <View className="flex-row items-center px-6 pb-2 pt-3">
        <View className="min-h-10 flex-1 flex-row items-center justify-start">
          {!disableBack ? (
            <Pressable
              onPress={handleBack}
              className="h-10 w-10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="뒤로 가기"
            >
              <Ionicons name="chevron-back" size={28} color="#0D0F1B" />
            </Pressable>
          ) : null}
        </View>

        <View className="max-w-[60%] items-center px-2">{centerContent}</View>

        <View className="min-h-10 flex-1 flex-row items-center justify-end">
          {rightContent}
        </View>
      </View>

      {subtitle ? (
        <View className="px-6 pb-3">
          <Text
            className={`text-sm text-gray-500 ${
              subtitleAlign === "center" ? "text-center" : ""
            }`}
          >
            {subtitle}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

/** 헤더 우측용 원형 아이콘 버튼 */
export const HeaderIconButton = ({
  onPress,
  accessibilityLabel,
  children,
}: {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}) => (
  <Pressable
    onPress={onPress}
    className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
  >
    {children}
  </Pressable>
);

export default Header;
