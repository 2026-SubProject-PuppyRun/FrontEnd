import ConvexShadowSurface from "@/components/ui/ConvexShadowSurface";
import {
  getRouteCardLayout,
  RED_BUTTON_EFFECT,
} from "@/constants/redButtonEffect";
import { Text, useWindowDimensions, View } from "react-native";

const MyRouteCard = () => {
  const { width: windowWidth } = useWindowDimensions();
  const layout = getRouteCardLayout(windowWidth);

  return (
    <View className="mt-10 w-full items-center justify-center">
      <ConvexShadowSurface
        shadowPadding={layout.shadowPad}
        style={layout.myRouteSize}
        backgroundColor={RED_BUTTON_EFFECT.fill}
      >
        <View className="flex-1 items-center justify-center px-2">
          <Text
            className="text-center font-semibold uppercase tracking-wide text-[#FAFAFA]"
            style={{ fontSize: layout.titleSize }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            MY ROUTE
          </Text>
        </View>
      </ConvexShadowSurface>
    </View>
  );
};

export default MyRouteCard;
