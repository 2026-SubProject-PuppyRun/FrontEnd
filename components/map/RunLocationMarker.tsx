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

const HEADING_ANIMATION_MS = 140;

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
      zIndex={999}
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
        {/*
         * 회전축은 컨테이너 중심(20,20).
         * 화살표를 흐름에 두면 원 중심이 축에서 3.5 밀려 heading이 바뀔 때마다
         * 원이 축 주위를 궤도처럼 돌며 흔들린다. 화살표만 absolute로 띄워
         * 원 중심 = 회전축이 되게 맞춘다.
         */}
        <View
          style={{
            position: "absolute",
            top: 1,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
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
              borderRadius: 2,
            }}
          />
        </View>
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
