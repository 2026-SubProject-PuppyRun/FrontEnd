import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { getRandomTips } from "@/constants/todayTips";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TipBoardProps {
  isMapLoaded: boolean;
}

const TIP_BOARD_FILL = "#7EB2FE";
const TIP_ROTATE_MS = 4000;

const TipBoard = ({ isMapLoaded }: TipBoardProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
  const tips = useMemo(() => getRandomTips(3), []);
  const [tipIndex, setTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (tips.length <= 1) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        setTipIndex((prev) => (prev + 1) % tips.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, TIP_ROTATE_MS);

    return () => {
      clearInterval(interval);
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim, tips.length]);

  if (!isMapLoaded) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: bottomInset,
      }}
    >
      <RedButtonSurface
        borderRadius={36}
        backgroundColor={TIP_BOARD_FILL}
        shadowPadding={8}
        hostStyle={{ width: "88%", maxWidth: 400 }}
        style={{ width: "100%", height: 72 }}
      >
        <Animated.View
          className="flex-1 items-center justify-center px-5"
          style={{ opacity: fadeAnim }}
        >
          <Text
            className="text-center font-spoqa-medium text-[15px] leading-5 text-white"
            numberOfLines={2}
          >
            💡 {tips[tipIndex]}
          </Text>
        </Animated.View>
      </RedButtonSurface>
    </View>
  );
};

export default TipBoard;
