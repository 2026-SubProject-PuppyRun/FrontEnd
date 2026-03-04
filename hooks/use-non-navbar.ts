import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

const useNonNavbar = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);
};

export default useNonNavbar;
