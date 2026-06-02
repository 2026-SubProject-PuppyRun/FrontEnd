import {
  getConvexBevelOverlayStyle,
  getConvexDropLayerStyle,
  getRedButtonBoxShadow,
  RED_BUTTON_EFFECT,
} from "@/constants/redButtonEffect";
import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";

type AnimatedViewStyle = AnimatedStyle<ViewStyle>;

export interface ConvexShadowSurfaceProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  shadowPadding?: number;
  hostStyle?: ViewStyle;
  borderRadius?: number;
  backgroundColor?: string;
  withDropShadow?: boolean;
  withBevel?: boolean;
  /** 있으면 베벨을 별도 레이어로 두고 opacity 애니메이션 (스와이퍼) */
  fillStyle?: AnimatedViewStyle;
  bevelStyle?: AnimatedViewStyle;
}

/**
 * 볼록 그림자 surface
 *
 * - fill은 카드 1겹만 (베벨 레이어에 backgroundColor 중복 금지)
 * - boxShadow만 사용 (legacy shadow* + boxShadow 이중 적용 금지)
 * - 정적: drop + inset을 한 View에
 * - bevelStyle 있을 때만 drop / inset 레이어 분리
 */
const ConvexShadowSurface = ({
  children,
  className,
  style,
  shadowPadding = 0,
  hostStyle,
  borderRadius = RED_BUTTON_EFFECT.borderRadius,
  backgroundColor = RED_BUTTON_EFFECT.fill,
  withDropShadow = true,
  withBevel = true,
  fillStyle,
  bevelStyle,
}: ConvexShadowSurfaceProps) => {
  const shadowOpts = { borderRadius, withDropShadow, withBevel };
  const splitBevelLayer = bevelStyle != null;
  const isAnimated = fillStyle != null || bevelStyle != null;
  const CardRoot = isAnimated ? Animated.View : View;
  const BevelRoot = isAnimated ? Animated.View : View;

  const cardShadowStyle: ViewStyle = splitBevelLayer
    ? getConvexDropLayerStyle(shadowOpts)
    : {
        borderRadius,
        overflow: "visible",
        boxShadow: getRedButtonBoxShadow({
          withDropShadow,
          withBevel,
        }),
      };

  const card = (
    <CardRoot
      style={[
        styles.card,
        { borderRadius, backgroundColor },
        cardShadowStyle,
        fillStyle,
        style,
      ]}
    >
      {splitBevelLayer && withBevel ? (
        <BevelRoot
          pointerEvents="none"
          style={[getConvexBevelOverlayStyle(shadowOpts), bevelStyle]}
        />
      ) : null}
      {children}
    </CardRoot>
  );

  if (shadowPadding <= 0) {
    return (
      <View className={className} style={hostStyle}>
        {card}
      </View>
    );
  }

  return (
    <View
      className={className}
      style={[styles.host, { padding: shadowPadding }, hostStyle]}
    >
      {card}
    </View>
  );
};

const styles = StyleSheet.create({
  host: {
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ConvexShadowSurface;
