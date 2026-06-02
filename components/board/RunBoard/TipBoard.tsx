import RedButtonSurface from "@/components/ui/RedButtonSurface";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TipBoardProps {
  isMapLoaded: boolean;
}

const TIP_BOARD_FILL = "#7EB2FE";

const TipBoard = ({ isMapLoaded }: TipBoardProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);
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
        <View className="flex-1 items-center justify-center px-4 ">
          <Text className="text-[25px] text-white">TO DAY TIP</Text>
        </View>
      </RedButtonSurface>
    </View>
  );
};

export default TipBoard;
