import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tracking = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text>tracking</Text>
    </View>
  );
};

export default Tracking;
