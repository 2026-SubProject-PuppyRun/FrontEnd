import { Pressable, Text, View } from "react-native";
import GoogleLoginSymbol from "./GoogleLoginSymbol";
import {
  LOGIN_BUTTON_BORDER_RADIUS,
  loginButtonContainerStyle,
} from "./loginButtonStyles";

const GOOGLE_LABEL = "Google 계정으로 로그인";

type GoogleLoginButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const GoogleLoginButton = ({ onPress, disabled }: GoogleLoginButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={GOOGLE_LABEL}
    style={[
      loginButtonContainerStyle,
      {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#747775",
        borderRadius: LOGIN_BUTTON_BORDER_RADIUS,
        opacity: disabled ? 0.4 : 1,
      },
    ]}
  >
    <View className="flex-1 flex-row items-center justify-center gap-3">
      <GoogleLoginSymbol size={20} />
      <Text
        style={{
          color: "#1F1F1F",
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {GOOGLE_LABEL}
      </Text>
    </View>
  </Pressable>
);

export default GoogleLoginButton;
