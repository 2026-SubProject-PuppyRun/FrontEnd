import { Image, Pressable } from "react-native";
import { loginButtonContainerStyle } from "./loginButtonStyles";

const KAKAO_LOGIN_BUTTON = require("@/assets/images/kakao/kakao_login_large_wide.png");
const KAKAO_LABEL = "카카오 로그인";

type KakaoLoginButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

/** 카카오 로그인 공식 디자인 리소스 버튼 */
const KakaoLoginButton = ({ onPress, disabled }: KakaoLoginButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={KAKAO_LABEL}
    style={[loginButtonContainerStyle, { opacity: disabled ? 0.4 : 1 }]}
  >
    <Image
      source={KAKAO_LOGIN_BUTTON}
      accessibilityIgnoresInvertColors
      style={{ width: "100%", height: "100%" }}
      resizeMode="stretch"
    />
  </Pressable>
);

export default KakaoLoginButton;
