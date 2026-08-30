import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

type GoogleLoginButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

/** Google Sign-In 브랜딩 가이드 공식 버튼 */
const GoogleLoginButton = ({ onPress, disabled }: GoogleLoginButtonProps) => (
  <GoogleSigninButton
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Light}
    disabled={disabled}
    style={{ width: "100%", height: 48 }}
    onPress={onPress}
  />
);

export default GoogleLoginButton;
