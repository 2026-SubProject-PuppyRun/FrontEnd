import ConvexShadowSurface, {
  ConvexShadowSurfaceProps,
} from "@/components/ui/ConvexShadowSurface";
import { RED_BUTTON_EFFECT } from "@/constants/redButtonEffect";

type RedButtonSurfaceProps = Omit<
  ConvexShadowSurfaceProps,
  "borderRadius" | "backgroundColor"
> &
  Partial<Pick<ConvexShadowSurfaceProps, "borderRadius" | "backgroundColor">>;

/**
 * 브랜드 레드(#F25857) 볼록 카드 — ConvexShadowSurface 프리셋
 */
const RedButtonSurface = ({
  borderRadius = RED_BUTTON_EFFECT.borderRadius,
  backgroundColor = RED_BUTTON_EFFECT.fill,
  withDropShadow = true,
  withBevel = true,
  ...props
}: RedButtonSurfaceProps) => (
  <ConvexShadowSurface
    borderRadius={borderRadius}
    backgroundColor={backgroundColor}
    withDropShadow={withDropShadow}
    withBevel={withBevel}
    {...props}
  />
);

export default RedButtonSurface;
