import PetDashBoard from "@/components/board/PetBoard/PetDashBoard";
import { usePetStore } from "@/store/usePetStore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { StyleSheet, View } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

const resolvePetId = (
  value: string | string[] | undefined,
): string | undefined => {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export default function PetCareTabsLayout() {
  const params = useLocalSearchParams<{ petId: string }>();
  const petId = resolvePetId(params.petId);
  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === petId),
  );

  if (!pet) {
    return null;
  }

  return (
    <View style={styles.container}>
      <PetDashBoard pet={pet} />
      <View style={styles.tabsWrapper}>
        <MaterialTopTabs
          initialRouteName="diet"
          screenOptions={{
            tabBarActiveTintColor: "#0D0F1B",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarIndicatorStyle: { backgroundColor: "#0D0F1B", height: 2 },
            tabBarLabelStyle: { fontWeight: "700", fontSize: 14 },
            tabBarStyle: styles.tabBar,
            sceneStyle: styles.scene,
          }}
        >
          <MaterialTopTabs.Screen name="diet" options={{ title: "식단" }} />
          <MaterialTopTabs.Screen name="weight" options={{ title: "체중" }} />
          <MaterialTopTabs.Screen name="vaccine" options={{ title: "접종" }} />
          <MaterialTopTabs.Screen
            name="allergy"
            options={{ title: "알러지" }}
          />
        </MaterialTopTabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "white",
  },
  tabsWrapper: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
  },
  scene: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
