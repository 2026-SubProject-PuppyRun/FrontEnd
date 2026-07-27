import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabRouteName = "care" | "mypage" | "home" | "running" | "guide";

const TAB_ORDER: TabRouteName[] = [
  "care",
  "mypage",
  "home",
  "running",
  "guide",
];

const TAB_ICONS: Record<TabRouteName, keyof typeof Ionicons.glyphMap> = {
  care: "paw",
  mypage: "person",
  home: "home",
  running: "walk",
  guide: "book",
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options;
  const focusedTabBarStyle = focusedOptions?.tabBarStyle;

  const isHiddenByOption =
    typeof focusedTabBarStyle === "object" &&
    focusedTabBarStyle !== null &&
    "display" in focusedTabBarStyle &&
    focusedTabBarStyle.display === "none";

  if (isHiddenByOption) {
    return null;
  }

  const visibleRoutes = TAB_ORDER.map((name) =>
    state.routes.find((route) => route.name === name),
  ).filter((route): route is (typeof state.routes)[number] => !!route);

  return (
    <View
      className="z-40 items-center justify-center"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: bottomInset,
      }}
      pointerEvents="box-none"
    >
      <View className="h-[72px] w-[88%] max-w-[400px] flex-row items-center justify-between rounded-full bg-[#0D0F1B] px-5">
        {visibleRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconName = TAB_ICONS[route.name as TabRouteName];

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="h-16 flex-1 items-center justify-center"
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={
                route.name === "mypage" ? "마이페이지" : route.name
              }
            >
              <View
                className={`${isFocused ? "h-[66px] w-[66px] items-center justify-center rounded-full bg-white" : ""}`}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? "#0D0F1B" : "white"}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
