import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { type Href, router } from "expo-router";
import { useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type TabRouteName = "care" | "mypage" | "home" | "running" | "guide";

const TAB_ORDER: TabRouteName[] = [
  "care",
  "home",
  "running",
  "mypage",
  "guide",
];

/** 탭 재탭 시 pop-to-root 대상 (각 탭의 첫 화면) */
const TAB_ROOTS: Record<TabRouteName, Href> = {
  care: "/(tabs)/care/pets",
  home: "/(tabs)/home",
  running: "/(tabs)/running",
  mypage: "/(tabs)/mypage",
  guide: "/(tabs)/guide",
};

const goToTabRoot = (name: TabRouteName) => {
  router.dismissTo(TAB_ROOTS[name]);
};

const handleTabPress = (
  navigation: BottomTabBarProps["navigation"],
  route: BottomTabBarProps["state"]["routes"][number],
  isFocused: boolean,
  name: TabRouteName,
) => {
  const event = navigation.emit({
    type: "tabPress",
    target: route.key,
    canPreventDefault: true,
  });
  if (event.defaultPrevented) return;

  if (isFocused) {
    goToTabRoot(name);
    return;
  }

  navigation.navigate(route.name, route.params);
};

const TAB_ICONS: Record<TabRouteName, keyof typeof Ionicons.glyphMap> = {
  care: "paw",
  mypage: "person",
  home: "home",
  running: "paw",
  guide: "book",
};

const TAB_LABELS: Record<TabRouteName, string> = {
  care: "케어",
  home: "홈",
  running: "산책",
  mypage: "마이",
  guide: "가이드",
};

const PILL_HEIGHT = 72;
const PILL_RADIUS = 36;
const FAB_SIZE = 78;
const FAB_ICON_SIZE = 38;
const FAB_SHADOW_PAD = 8;
/** FAB ↔ 바 사이 투명 공백 */
const NOTCH_GAP = 8;
const NOTCH_RADIUS = FAB_SIZE / 2 + NOTCH_GAP;
/**
 * 구멍·FAB 중심 Y.
 */
const NOTCH_CENTER_Y = 8;
const FAB_TOP = NOTCH_CENTER_Y - FAB_SIZE / 2 - FAB_SHADOW_PAD;
const FAB_OVERHANG = Math.max(0, -FAB_TOP) + 6;

/**
 * 둥근 필 + 원형 구멍(evenodd).
 */
const buildNotchedPillPath = (width: number, height: number) => {
  const r = Math.min(PILL_RADIUS, height / 2);
  const nr = NOTCH_RADIUS;
  const cx = width / 2;
  const cy = NOTCH_CENTER_Y;

  const outer = [
    `M ${r} 0`,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 1 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 1 ${width - r} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 1 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");

  const hole = [
    `M ${cx - nr} ${cy}`,
    `A ${nr} ${nr} 0 1 1 ${cx + nr} ${cy}`,
    `A ${nr} ${nr} 0 1 1 ${cx - nr} ${cy}`,
    "Z",
  ].join(" ");

  return `${outer} ${hole}`;
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  const [barWidth, setBarWidth] = useState(0);

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

  const runningRoute = visibleRoutes.find((r) => r.name === "running");

  const onBarLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      className="z-40 items-center justify-center"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: bottomInset,
        paddingTop: FAB_OVERHANG,
        overflow: "visible",
      }}
      pointerEvents="box-none"
    >
      <View
        className="w-[88%] max-w-[400px]"
        style={{
          height: PILL_HEIGHT,
          overflow: "visible",
        }}
        onLayout={onBarLayout}
        pointerEvents="box-none"
      >
        {barWidth > 0 ? (
          <Svg
            width={barWidth}
            height={PILL_HEIGHT}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <Path
              d={buildNotchedPillPath(barWidth, PILL_HEIGHT)}
              fill="#0D0F1B"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </Svg>
        ) : (
          <View className="absolute inset-0 rounded-full bg-[#0D0F1B]" />
        )}

        <View className="h-full flex-row items-center justify-between px-2">
          {visibleRoutes.map((route) => {
            const routeIndex = state.routes.findIndex(
              (r) => r.key === route.key,
            );
            const isFocused = state.index === routeIndex;
            const name = route.name as TabRouteName;
            const isCenter = name === "running";

            const onPress = () => {
              handleTabPress(navigation, route, isFocused, name);
            };

            if (isCenter) {
              return (
                <View
                  key={route.key}
                  className="flex-1 items-center justify-center"
                  pointerEvents="none"
                >
                  <View style={{ width: NOTCH_RADIUS * 2, height: 1 }} />
                </View>
              );
            }

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                className="h-16 flex-1 items-center justify-center"
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={TAB_LABELS[name]}
              >
                <View
                  className={`items-center justify-center ${
                    isFocused ? "h-11 w-11 rounded-full bg-white" : "h-11 w-11"
                  }`}
                >
                  <Ionicons
                    name={TAB_ICONS[name]}
                    size={22}
                    color={isFocused ? "#0D0F1B" : "rgba(255,255,255,0.72)"}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 노치 안에 떠 있는 FAB */}
        {runningRoute ? (
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: "50%",
              top: FAB_TOP,
              marginLeft: -(FAB_SIZE + FAB_SHADOW_PAD * 2) / 2,
              width: FAB_SIZE + FAB_SHADOW_PAD * 2,
              height: FAB_SIZE + FAB_SHADOW_PAD * 2,
              zIndex: 20,
            }}
          >
            <RedButtonSurface
              borderRadius={FAB_SIZE / 2}
              backgroundColor="#F25857"
              shadowPadding={FAB_SHADOW_PAD}
              hostStyle={{
                width: FAB_SIZE + FAB_SHADOW_PAD * 2,
                height: FAB_SIZE + FAB_SHADOW_PAD * 2,
              }}
              style={{
                width: FAB_SIZE,
                height: FAB_SIZE,
              }}
            >
              <Pressable
                onPress={() => {
                  const routeIndex = state.routes.findIndex(
                    (r) => r.key === runningRoute.key,
                  );
                  const isFocused = state.index === routeIndex;
                  handleTabPress(navigation, runningRoute, isFocused, "running");
                }}
                className="h-full w-full items-center justify-center"
                style={({ pressed }) =>
                  pressed
                    ? { opacity: 0.88, transform: [{ scale: 0.96 }] }
                    : undefined
                }
                accessibilityRole="button"
                accessibilityLabel="산책"
              >
                <MaterialCommunityIcons
                  name="dog-side"
                  size={FAB_ICON_SIZE + 4}
                  color="#FFFFFF"
                />
              </Pressable>
            </RedButtonSurface>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CustomTabBar;

export const TAB_BAR_FAB_OVERHANG = FAB_OVERHANG;
export const TAB_BAR_PILL_HEIGHT = PILL_HEIGHT;
