import React from "react";
import { Text, View } from "react-native";

interface RecRouteSwiperItemProps {
  routeNumber: number;
  distanceKm?: string;
}

const RecRouteSwiperItem = ({
  routeNumber,
  distanceKm = "3.00km",
}: RecRouteSwiperItemProps) => (
  <View className="flex-1 items-center justify-center px-2">
    <Text className="text-center text-[32px] font-bold uppercase tracking-wide text-[#FAFAFA]">
      ROUTE {routeNumber}
    </Text>
    <Text className="mt-0.5 text-center text-[22px] font-bold italic text-[#FAFAFA]">
      {distanceKm}
    </Text>
  </View>
);

export default RecRouteSwiperItem;
