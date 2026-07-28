import Header from "@/components/header/Header";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const MetarialTopTabs = withLayoutContext(Navigator);

export default function GuideLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}
      className="flex-1 bg-[#F7F7F7]"
    >
      <Header showLogo disableBack />
      <MetarialTopTabs
        screenOptions={{
          tabBarActiveTintColor: "#0D0F1B",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarIndicatorStyle: { backgroundColor: "#F25857" },
          tabBarLabelStyle: { fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "#F7F7F7" },
        }}
      >
        <MetarialTopTabs.Screen name="index" options={{ title: "견종 백과" }} />
        <MetarialTopTabs.Screen name="law" options={{ title: "법률 정보" }} />
      </MetarialTopTabs>
    </View>
  );
}
