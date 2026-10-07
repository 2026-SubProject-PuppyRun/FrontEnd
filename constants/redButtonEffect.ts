import { StyleSheet, ViewStyle } from "react-native";

export const ROUTE_CARD_SIZE = {
  width: 192,
  height: 107,
} as const;

export const ROUTE_CARD_SHADOW_PAD = 20;

export const ROUTE_SLIDE_SIZE = {
  height: ROUTE_CARD_SIZE.height + ROUTE_CARD_SHADOW_PAD * 2,
} as const;

export const ROUTE_SIDE_CARD_VISIBLE_RATIO = 2 / 3;

export const ROUTE_CARD_GAP = 34;

export type RouteCardLayout = {
  cardSize: { width: number; height: number };
  myRouteSize: { width: number; height: number };
  shadowPad: number;
  titleSize: number;
  distanceSize: number;
  slideHeight: number;
  parallaxOffset: number;
  cardGap: number;
};

/** 화면 너비에 맞춘 루트 카드/MY ROUTE 크기 */
export const getRouteCardLayout = (screenWidth: number): RouteCardLayout => {
  const isCompact = screenWidth < 375;
  const cardWidth = isCompact
    ? Math.min(168, Math.max(148, screenWidth - 140))
    : ROUTE_CARD_SIZE.width;
  const cardHeight = isCompact ? 96 : ROUTE_CARD_SIZE.height;
  const shadowPad = isCompact ? 12 : ROUTE_CARD_SHADOW_PAD;
  const cardGap = isCompact ? 24 : ROUTE_CARD_GAP;
  const myRouteWidth = Math.min(288, Math.max(220, screenWidth - 48));

  return {
    cardSize: { width: cardWidth, height: cardHeight },
    myRouteSize: {
      width: myRouteWidth,
      height: isCompact ? 64 : 73,
    },
    shadowPad,
    titleSize: isCompact ? 26 : 32,
    distanceSize: isCompact ? 18 : 22,
    slideHeight: cardHeight + shadowPad * 2,
    parallaxOffset: Math.round(screenWidth - cardWidth - cardGap + 30),
    cardGap,
  };
};

export const getRouteParallaxOffset = (screenWidth: number) =>
  getRouteCardLayout(screenWidth).parallaxOffset;

const blendOverMap = (
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number },
  alpha: number,
) => {
  const r = Math.round(fg.r * alpha + bg.r * (1 - alpha));
  const g = Math.round(fg.g * alpha + bg.g * (1 - alpha));
  const b = Math.round(fg.b * alpha + bg.b * (1 - alpha));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

export const ROUTE_SWIPER_INACTIVE = {
  scale: 0.7,
  fill: blendOverMap(
    { r: 230, g: 109, b: 102 },
    { r: 232, g: 232, b: 232 },
    0.7,
  ),
} as const;

export const RED_BUTTON_EFFECT = {
  /** Figma target center color: #F25857 (RN inset 합성 전 보정용 fill) */
  fill: "#E66D65",
  borderRadius: 20,
  insetHighlight: {
    offsetX: 2,
    offsetY: 2,
    blurRadius: 3,
    color: "rgba(255, 255, 255, 0.15)",
  },
  insetShade: {
    offsetX: -2,
    offsetY: -2,
    blurRadius: 3,
    color: "rgba(0, 0, 0, 0.18)",
  },
  dropShadow: {
    offsetX: 3,
    offsetY: 7,
    blurRadius: 12,
    spreadDistance: 0,
    color: "rgba(0, 0, 0, 0.30)",
  },
} as const;

export type ConvexShadowOptions = {
  borderRadius?: number;
  withDropShadow?: boolean;
  withBevel?: boolean;
};

export const RED_BUTTON_BOX_SHADOW_DROP_ONLY: NonNullable<
  ViewStyle["boxShadow"]
> = [
  {
    offsetX: RED_BUTTON_EFFECT.dropShadow.offsetX,
    offsetY: RED_BUTTON_EFFECT.dropShadow.offsetY,
    blurRadius: RED_BUTTON_EFFECT.dropShadow.blurRadius,
    spreadDistance: RED_BUTTON_EFFECT.dropShadow.spreadDistance,
    color: RED_BUTTON_EFFECT.dropShadow.color,
  },
];

export const RED_BUTTON_BOX_SHADOW_INSET_ONLY: NonNullable<
  ViewStyle["boxShadow"]
> = [
  {
    offsetX: RED_BUTTON_EFFECT.insetHighlight.offsetX,
    offsetY: RED_BUTTON_EFFECT.insetHighlight.offsetY,
    blurRadius: RED_BUTTON_EFFECT.insetHighlight.blurRadius,
    color: RED_BUTTON_EFFECT.insetHighlight.color,
    inset: true,
  },
  {
    offsetX: RED_BUTTON_EFFECT.insetShade.offsetX,
    offsetY: RED_BUTTON_EFFECT.insetShade.offsetY,
    blurRadius: RED_BUTTON_EFFECT.insetShade.blurRadius,
    color: RED_BUTTON_EFFECT.insetShade.color,
    inset: true,
  },
];

export const RED_BUTTON_BOX_SHADOW: NonNullable<ViewStyle["boxShadow"]> = [
  ...RED_BUTTON_BOX_SHADOW_DROP_ONLY,
  ...RED_BUTTON_BOX_SHADOW_INSET_ONLY,
];

/** @deprecated boxShadow만 사용 — legacy shadow*는 색을 이중으로 어둡게 함 */
export const redButtonLegacyDropShadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: {
    width: RED_BUTTON_EFFECT.dropShadow.offsetX,
    height: RED_BUTTON_EFFECT.dropShadow.offsetY,
  },
  shadowOpacity: 0.25,
  shadowRadius: RED_BUTTON_EFFECT.dropShadow.blurRadius,
  elevation: 10,
};

export const getRedButtonBoxShadow = (
  options: ConvexShadowOptions = {},
): ViewStyle["boxShadow"] => {
  const withDropShadow = options.withDropShadow ?? true;
  const withBevel = options.withBevel ?? true;

  if (!withDropShadow && !withBevel) {
    return undefined;
  }
  if (withDropShadow && withBevel) {
    return RED_BUTTON_BOX_SHADOW;
  }
  if (withDropShadow) {
    return RED_BUTTON_BOX_SHADOW_DROP_ONLY;
  }
  return RED_BUTTON_BOX_SHADOW_INSET_ONLY;
};

/** split 레이어용 — 바깥 drop만 */
export const getConvexDropLayerStyle = (
  options: ConvexShadowOptions = {},
): ViewStyle => {
  const borderRadius = options.borderRadius ?? RED_BUTTON_EFFECT.borderRadius;
  const withDropShadow = options.withDropShadow ?? true;

  if (!withDropShadow) {
    return { borderRadius, overflow: "visible" as const };
  }

  return {
    borderRadius,
    overflow: "visible",
    boxShadow: RED_BUTTON_BOX_SHADOW_DROP_ONLY,
  };
};

/** split 레이어용 — inset만 (backgroundColor 없음 → fill 중복 방지) */
export const getConvexBevelOverlayStyle = (
  options: ConvexShadowOptions = {},
): ViewStyle => {
  const borderRadius = options.borderRadius ?? RED_BUTTON_EFFECT.borderRadius;
  const withBevel = options.withBevel ?? true;

  if (!withBevel) {
    return {};
  }

  return {
    ...StyleSheet.absoluteFillObject,
    borderRadius,
    boxShadow: RED_BUTTON_BOX_SHADOW_INSET_ONLY,
  };
};

/** 단일 View — fill + boxShadow (legacy shadow* 없음) */
export const getRedButtonSurfaceStyle = (
  options: ConvexShadowOptions & {
    backgroundColor?: string;
  } = {},
): ViewStyle => ({
  backgroundColor: options.backgroundColor ?? RED_BUTTON_EFFECT.fill,
  borderRadius: options.borderRadius ?? RED_BUTTON_EFFECT.borderRadius,
  overflow: "visible",
  boxShadow: getRedButtonBoxShadow({
    withDropShadow: options.withDropShadow ?? true,
    withBevel: options.withBevel ?? true,
  }),
});
