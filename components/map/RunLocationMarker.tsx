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

/**
 * 기존 디자인: 빨간 화살표 + 투명 갭 + (빨간 원 / 크림 / 발바닥)
 * MapView 비트맵 제한 때문에 전체를 빨간 원으로 감싸지 않고,
 * 투명 캔버스 위에 실루엣만 그려 맵이 비치게 한다.
 */
const MARKER_SIZE = 40;
const CIRCLE_SIZE = 24;
const ARROW_HEIGHT = 5;
const ARROW_HALF_WIDTH = 4;
const GAP = 2;

const STACK_HEIGHT = ARROW_HEIGHT + GAP + CIRCLE_SIZE;
const CIRCLE_CENTER_Y = ARROW_HEIGHT + GAP + CIRCLE_SIZE / 2;

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

  const stackTop = MARKER_SIZE / 2 - CIRCLE_CENTER_Y;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksViewChanges}
      zIndex={999}
      flat
    >
      {/* 투명 캡처 영역 — 빨간 배경으로 채우지 않음 */}
      <View
        collapsable={false}
        style={{
          width: MARKER_SIZE,
          height: MARKER_SIZE,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        <Animated.View
          collapsable={false}
          style={[
            {
              position: "absolute",
              top: stackTop,
              width: CIRCLE_SIZE,
              height: STACK_HEIGHT,
              alignItems: "center",
              transformOrigin: `${CIRCLE_SIZE / 2}px ${CIRCLE_CENTER_Y}px`,
            },
            markerStyle,
          ]}
        >
          {/* 진행 방향 화살표 (기존과 동일하게 빨강) */}
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: ARROW_HALF_WIDTH,
              borderRightWidth: ARROW_HALF_WIDTH,
              borderBottomWidth: ARROW_HEIGHT,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#F25857",
            }}
          />
          {/* 투명 라인 — 맵이 비쳐 화살표·원이 분리돼 보임 */}
          <View style={{ height: GAP, width: ARROW_HALF_WIDTH * 2 }} />
          <View
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
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
      </View>
    </Marker>
  );
};

export default RunLocationMarker;
