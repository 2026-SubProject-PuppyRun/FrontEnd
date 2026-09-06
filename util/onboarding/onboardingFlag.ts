import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETE_KEY = "onboarding-complete";

export const isOnboardingComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
  return value === "true";
};

export const setOnboardingComplete = async () => {
  await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
};

export const clearOnboardingComplete = async () => {
  await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
};
