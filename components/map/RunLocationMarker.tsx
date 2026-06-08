import { getShortestAngleDelta } from "@/util/map/markerHeading";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const HEADING_ANIMATION_MS = 280;

type RunLocationMarkerProps = {
  latitude: number;
  longitude: number;
  heading: number;
};

const RunLocationMarker = ({
  latitude,
  longitude,
  heading,
}: RunLocationMarkerProps) => {
  const animatedHeadingRef = useRef(heading);
  const rotation = useSharedValue(heading);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const from = animatedHeadingRef.current;
    const to = from + getShortestAngleDelta(from, heading);
    animatedHeadingRef.current = to;

    setTracksViewChanges(true);
    rotation.value = withTiming(
      to,
      { duration: HEADING_ANIMATION_MS },
      (finished) => {
        if (finished) {
          runOnJS(setTracksViewChanges)(false);
        }
      },
    );
  }, [heading, rotation]);

  const markerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksViewChanges}
      zIndex={10}
      flat
    >
      <Animated.View
        collapsable={false}
        style={[
          {
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          },
          markerStyle,
        ]}
      >
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderBottomWidth: 5,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "#F25857",
            marginBottom: 2,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#F25857",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#FDECEA",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="paw" size={12} color="#F25857" />
          </View>
        </View>
      </Animated.View>
    </Marker>
  );
};

export default RunLocationMarker;
