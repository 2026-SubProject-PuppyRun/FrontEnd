import React, { useState } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const Index = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  return (
    <View className="flex-1">
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider={PROVIDER_GOOGLE}
      ></MapView>
    </View>
  );
};

export default Index;
