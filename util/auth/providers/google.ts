import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
};

export const getGoogleAccessToken = async () => {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signIn();

  const tokens = await GoogleSignin.getTokens();
  if (!tokens.accessToken) {
    throw new Error("ACCESS_TOKEN_MISSING");
  }

  return tokens.accessToken;
};
