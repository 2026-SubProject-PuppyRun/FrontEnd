import { SPRITE_DISPLAY_SIZE } from "@/constants/petSpriteMap";
import { getPetSpritePack, getSpriteSheetMeta } from "@/util/pet";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

const WALK_FRAME_MS = 120;

interface PetSpriteInPlaceProps {
  breedCode: string;
  scale?: number;
  /**
   * 프레임에서 실제로 보여줄 중앙 비율 (0~1).
   * 작을수록 투명 여백을 더 잘라 캐릭터가 크게 보입니다.
   * @default 1 (크롭 없음)
   */
  contentScale?: number;
}

const PetSpriteInPlace = ({
  breedCode,
  scale = 1,
  contentScale = 1,
}: PetSpriteInPlaceProps) => {
  const pack = getPetSpritePack(breedCode);
  const { source, frameCount } = getSpriteSheetMeta(pack, "walk");
  const [frameIndex, setFrameIndex] = useState(0);

  const viewport = SPRITE_DISPLAY_SIZE * scale;
  const safeContentScale = Math.min(1, Math.max(0.4, contentScale));
  const frameSize = viewport / safeContentScale;
  const sheetDisplayWidth = frameCount * frameSize;
  // 하단 투명 여백이 더 크므로 세로 크롭을 위로 치우침
  const cropOffsetX = (frameSize - viewport) / 2;
  const cropOffsetY = (frameSize - viewport) * 0.28;

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
        width: viewport,
        height: viewport,
        overflow: "hidden",
      }}
    >
      <Image
        source={source}
        style={{
          width: sheetDisplayWidth,
          height: frameSize,
          transform: [
            {
              translateX: -frameIndex * frameSize - cropOffsetX,
            },
            { translateY: -cropOffsetY },
          ],
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

export default PetSpriteInPlace;
