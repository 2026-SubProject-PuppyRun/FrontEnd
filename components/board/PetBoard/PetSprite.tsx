import {
  SPRITE_DISPLAY_SIZE,
  SPRITE_NAME_TAG_HEIGHT,
  SPRITE_NAME_TAG_TOP,
  SpriteAction,
} from "@/constants/petSpriteMap";
import { WanderBounds, usePetWander } from "@/hooks/use-pet-wander";
import {
  getPetSpritePack,
  getSpritePackKey,
  getSpriteSheetMeta,
} from "@/util/pet";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface PetSpriteProps {
  breedCode: string;
  petIndex: number;
  bounds: WanderBounds;
  name?: string;
  accentColor?: string;
  scale?: number;
  onPress?: () => void;
}

const WALK_FRAME_MS = 120;
const IDLE_FRAME_MS = 200;

const PetSprite = ({
  breedCode,
  petIndex,
  bounds,
  name,
  accentColor = "#FFFFFF",
  scale = 1,
  onPress,
}: PetSpriteProps) => {
  const spritePackKey = getSpritePackKey(breedCode);
  const pack = getPetSpritePack(breedCode);
  const { x, y, facingLeft, isWalking } = usePetWander({ bounds, petIndex });

  const action: SpriteAction = isWalking ? "walk" : "idle";
  const [frameIndex, setFrameIndex] = useState(0);

  const { source, frameCount } = getSpriteSheetMeta(pack, action);
  const frameMs = action === "walk" ? WALK_FRAME_MS : IDLE_FRAME_MS;

  const displaySize = SPRITE_DISPLAY_SIZE * scale;
  const nameTagTop = SPRITE_NAME_TAG_TOP * scale;
  const nameTagHeight = SPRITE_NAME_TAG_HEIGHT * scale;

  useEffect(() => {
    setFrameIndex(0);
  }, [action, spritePackKey, breedCode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, frameMs);
    return () => clearInterval(timer);
  }, [action, frameCount, frameMs]);

  const positionStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: x.value,
    top: y.value,
  }));

  const spriteFlipStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: facingLeft.value ? -1 : 1 }],
  }));

  const sheetDisplayWidth = frameCount * displaySize;

  return (
    <Animated.View style={positionStyle}>
      <Pressable onPress={onPress} accessibilityLabel={name}>
        <View
          style={{
            width: displaySize,
            height: nameTagTop + (name ? nameTagHeight : 0),
            alignItems: "center",
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: displaySize,
                height: displaySize,
                overflow: "hidden",
              },
              spriteFlipStyle,
            ]}
          >
            <Image
              key={`${spritePackKey}-${action}`}
              source={source}
              style={{
                width: sheetDisplayWidth,
                height: displaySize,
                transform: [{ translateX: -frameIndex * displaySize }],
              }}
              resizeMode="stretch"
            />
          </Animated.View>

          {name ? (
            <View
              style={{
                position: "absolute",
                top: nameTagTop,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 999,
                  paddingHorizontal: 8 * scale,
                  paddingVertical: 2 * scale,
                  backgroundColor: accentColor,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.65)",
                  maxWidth: displaySize + 24 * scale,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: Math.max(8, 10 * scale),
                    fontWeight: "600",
                    color: "#4A4035",
                  }}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default PetSprite;
