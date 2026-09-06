import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const BRAND = "#F25857";
const LOAD_MS = 2800;
const PUPPY_W = 78;
const PUPPY_H = 62;
const WAVE_H = 44;

type AnimatedSplashScreenProps = {
  onFinish: () => void;
};

const AnimatedSplashScreen = ({ onFinish }: AnimatedSplashScreenProps) => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const bounce = useSharedValue(0);
  const fade = useSharedValue(1);

  const trackWidth = Math.min(width * 0.78, 340);
  const puppyTravel = Math.max(trackWidth - PUPPY_W, 0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 150, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 150, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    progress.value = withTiming(
      1,
      { duration: LOAD_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (!finished) return;
        cancelAnimation(bounce);
        bounce.value = withTiming(0, { duration: 120 });
        fade.value = withTiming(0, { duration: 380 }, (done) => {
          if (done) runOnJS(onFinish)();
        });
      },
    );
  }, [bounce, fade, onFinish, progress]);

  const puppyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, puppyTravel],
          Extrapolation.CLAMP,
        ),
      },
      { translateY: bounce.value },
    ],
  }));

  const fillMax = Math.max(trackWidth * 0.96, 24);

  const fillStyle = useAnimatedStyle(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [8, fillMax],
      Extrapolation.CLAMP,
    ),
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.45, 0.78],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const rootStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      <View style={styles.logoWrap}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={[styles.trackSection, { width: trackWidth }]}>
        <View style={styles.waveWrap}>
          <Svg
            width={trackWidth}
            height={WAVE_H}
            viewBox={`0 0 ${trackWidth} ${WAVE_H}`}
            style={styles.waveSvg}
          >
            <Path
              d={`M4 ${WAVE_H * 0.55}
                C ${trackWidth * 0.14} ${WAVE_H * 0.28},
                  ${trackWidth * 0.26} ${WAVE_H * 0.78},
                  ${trackWidth * 0.4} ${WAVE_H * 0.5}
                S ${trackWidth * 0.66} ${WAVE_H * 0.22},
                  ${trackWidth * 0.8} ${WAVE_H * 0.48}
                S ${trackWidth * 0.92} ${WAVE_H * 0.7},
                  ${trackWidth - 4} ${WAVE_H * 0.52}`}
              stroke="#FFFFFF"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>

          <Animated.View style={[styles.puppy, puppyStyle]}>
            <Image
              source={require("@/assets/images/splash-puppy.png")}
              style={{ width: PUPPY_W, height: PUPPY_H }}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, fillStyle]} />
          <Animated.View style={[styles.dots, dotsStyle]} pointerEvents="none">
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </Animated.View>
        </View>

        <Text style={styles.tagline}>A RUNNING ADVENTURE</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 120,
    paddingBottom: 72,
  },
  logoWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 280,
    height: 280,
  },
  trackSection: {
    alignItems: "center",
    gap: 28,
    paddingBottom: 12,
  },
  waveWrap: {
    width: "100%",
    height: 88,
    justifyContent: "flex-end",
  },
  waveSvg: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  puppy: {
    position: "absolute",
    left: 0,
    bottom: 18,
  },
  barTrack: {
    width: "100%",
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    justifyContent: "center",
  },
  barFill: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  dots: {
    position: "absolute",
    right: 18,
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  tagline: {
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 1.2,
    fontWeight: "500",
  },
});

export default AnimatedSplashScreen;
