import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface RouteGuidanceToggleProps {
  /** 마지막으로 선택한 추천 경로 인덱스 */
  lastRouteIndex: number;
}

const RouteGuidanceToggle = ({ lastRouteIndex }: RouteGuidanceToggleProps) => {
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const setSelectedRoute = useRunStore((state) => state.setSelectedRoute);
  const recommendedRoutes = useRunStore((state) => state.recommendedRoutes);

  const routeEnabled = selectedRoute !== null;

  const handlePress = () => {
    if (!recommendedRoutes?.length) return;

    if (routeEnabled) {
      setSelectedRoute(null);
      return;
    }

    const index = Math.min(lastRouteIndex, recommendedRoutes.length - 1);
    setSelectedRoute(recommendedRoutes[index] ?? recommendedRoutes[0]);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      accessibilityRole="button"
      accessibilityLabel={routeEnabled ? "경로 안내 끄기" : "경로 안내 켜기"}
      accessibilityState={{ selected: routeEnabled }}
    >
      <Ionicons
        name={routeEnabled ? "flag" : "flag-outline"}
        size={22}
        color="#F25857"
      />
    </Pressable>
  );
};

export default RouteGuidanceToggle;
