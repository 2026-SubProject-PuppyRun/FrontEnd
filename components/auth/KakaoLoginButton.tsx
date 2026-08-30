import { Pressable, Text } from "react-native";
import KakaoLoginSymbol from "./KakaoLoginSymbol";

const KAKAO_YELLOW = "#FEE500";
const KAKAO_LABEL = "카카오 로그인";

type KakaoLoginButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

/** 카카오 로그인 디자인 가이드 버튼 */
const KakaoLoginButton = ({ onPress, disabled }: KakaoLoginButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={KAKAO_LABEL}
    className="w-full flex-row items-center justify-center"
    style={{
      backgroundColor: KAKAO_YELLOW,
      height: 48,
      borderRadius: 12,
      gap: 8,
      opacity: disabled ? 0.4 : 1,
    }}
  >
    <KakaoLoginSymbol size={18} />
    <Text
      style={{
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 16,
        fontWeight: "600",
      }}
    >
      {KAKAO_LABEL}
    </Text>
  </Pressable>
);

export default KakaoLoginButton;
