import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PILL_HEIGHT = 64;

const useNonNavbar = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    const tabBarHeight = PILL_HEIGHT + Math.max(insets.bottom, 10) + 8;

    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      });
    };
  }, [insets.bottom, navigation]);
};

export default useNonNavbar;
