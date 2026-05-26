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
} from "@/util/getPetSpritePack";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface PetSpriteProps {
  breedCode: string;
  petIndex: number;
  bounds: WanderBounds;
  name?: string;
  accentColor?: string;
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
  onPress,
}: PetSpriteProps) => {
  const spritePackKey = getSpritePackKey(breedCode);
  const pack = getPetSpritePack(breedCode);
  const { x, y, facingLeft, isWalking } = usePetWander({ bounds, petIndex });

  const action: SpriteAction = isWalking ? "walk" : "idle";
  const [frameIndex, setFrameIndex] = useState(0);

  const { source, frameCount } = getSpriteSheetMeta(pack, action);
  const frameMs = action === "walk" ? WALK_FRAME_MS : IDLE_FRAME_MS;

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

  const sheetDisplayWidth = frameCount * SPRITE_DISPLAY_SIZE;

  return (
    <Animated.View style={positionStyle}>
      <Pressable onPress={onPress} accessibilityLabel={name}>
        <View
          style={{
            width: SPRITE_DISPLAY_SIZE,
            height: SPRITE_NAME_TAG_TOP + (name ? SPRITE_NAME_TAG_HEIGHT : 0),
            alignItems: "center",
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: SPRITE_DISPLAY_SIZE,
                height: SPRITE_DISPLAY_SIZE,
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
                height: SPRITE_DISPLAY_SIZE,
                transform: [{ translateX: -frameIndex * SPRITE_DISPLAY_SIZE }],
              }}
              resizeMode="stretch"
            />
          </Animated.View>

          {name ? (
            <View
              style={{
                position: "absolute",
                top: SPRITE_NAME_TAG_TOP,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  backgroundColor: accentColor,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.65)",
                  maxWidth: SPRITE_DISPLAY_SIZE + 24,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
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
