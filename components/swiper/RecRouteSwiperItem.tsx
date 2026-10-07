import React from "react";
import { Text, View } from "react-native";

interface RecRouteSwiperItemProps {
  routeNumber: number;
  distanceKm?: string;
  titleSize?: number;
  distanceSize?: number;
}

const RecRouteSwiperItem = ({
  routeNumber,
  distanceKm = "3.00km",
  titleSize = 32,
  distanceSize = 22,
}: RecRouteSwiperItemProps) => (
  <View className="flex-1 items-center justify-center px-2">
    <Text
      className="text-center font-bold uppercase tracking-wide text-[#FAFAFA]"
      style={{ fontSize: titleSize }}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
    >
      ROUTE {routeNumber}
    </Text>
    <Text
      className="mt-0.5 text-center font-bold italic text-[#FAFAFA]"
      style={{ fontSize: distanceSize }}
      numberOfLines={1}
    >
      {distanceKm}
    </Text>
  </View>
);

export default RecRouteSwiperItem;
