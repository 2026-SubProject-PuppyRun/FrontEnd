import Header from "@/components/header/Header";
import { Slot } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      <Header title="반려견 목록" />
      <Slot />
    </View>
  );
}
