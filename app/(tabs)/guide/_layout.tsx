import Header from "@/components/header/Header";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const MetarialTopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      <Header title="가이드" />
      <MetarialTopTabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          tabBarIndicatorStyle: { backgroundColor: "black" },
          tabBarLabelStyle: { fontWeight: "bold" },
        }}
      >
        <MetarialTopTabs.Screen name="index" options={{ title: "견종 백과" }} />
        <MetarialTopTabs.Screen name="law" options={{ title: "법률 정보" }} />
      </MetarialTopTabs>
    </View>
  );
}
