import { SPRITE_DISPLAY_SIZE } from "@/constants/petSpriteMap";
import { getPetSpritePack, getSpriteSheetMeta } from "@/util/pet";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

const WALK_FRAME_MS = 120;

interface PetSpriteInPlaceProps {
  breedCode: string;
  scale?: number;
}

const PetSpriteInPlace = ({ breedCode, scale = 1 }: PetSpriteInPlaceProps) => {
  const pack = getPetSpritePack(breedCode);
  const { source, frameCount } = getSpriteSheetMeta(pack, "walk");
  const [frameIndex, setFrameIndex] = useState(0);
  const displaySize = SPRITE_DISPLAY_SIZE * scale;
  const sheetDisplayWidth = frameCount * displaySize;

  useEffect(() => {
    setFrameIndex(0);
  }, [breedCode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, WALK_FRAME_MS);
    return () => clearInterval(timer);
  }, [frameCount]);

  return (
    <View
      style={{
        width: displaySize,
        height: displaySize,
        overflow: "hidden",
      }}
    >
      <Image
        source={source}
        style={{
          width: sheetDisplayWidth,
          height: displaySize,
          transform: [{ translateX: -frameIndex * displaySize }],
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

export default PetSpriteInPlace;
