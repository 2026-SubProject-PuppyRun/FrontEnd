import ConvexShadowSurface from "@/components/ui/ConvexShadowSurface";
import {
  RED_BUTTON_EFFECT,
  ROUTE_CARD_SHADOW_PAD,
} from "@/constants/redButtonEffect";
import { Text, View } from "react-native";

const MyRouteCard = () => (
  <View className="mt-10 w-full items-center justify-center">
    <ConvexShadowSurface
      shadowPadding={ROUTE_CARD_SHADOW_PAD}
      style={{ width: 288, height: 73 }}
      backgroundColor={RED_BUTTON_EFFECT.fill}
    >
      <View className="flex-1 items-center justify-center px-2">
        <Text className="text-center text-[32px] font-semibold uppercase tracking-wide text-[#FAFAFA]">
          MY ROUTE
        </Text>
      </View>
    </ConvexShadowSurface>
  </View>
);

export default MyRouteCard;
