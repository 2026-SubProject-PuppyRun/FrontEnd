import {
  BREED_SPRITE_MAP,
  DEFAULT_SPRITE_PACK,
  SPRITE_PACKS,
  SpriteAction,
  SpritePack,
  SpritePackKey,
} from "@/constants/petSpriteMap";

export const getSpritePackKey = (breedCode: string | undefined): SpritePackKey => {
  if (!breedCode) return DEFAULT_SPRITE_PACK;
  return BREED_SPRITE_MAP[breedCode] ?? DEFAULT_SPRITE_PACK;
};

export const getPetSpritePack = (breedCode: string | undefined): SpritePack => {
  return SPRITE_PACKS[getSpritePackKey(breedCode)];
};

export const getSpriteSheetMeta = (
  pack: SpritePack,
  action: SpriteAction,
): { source: SpritePack[SpriteAction]; frameCount: number } => {
  if (action === "walk") {
    return { source: pack.walk, frameCount: pack.walkFrames };
  }
  return { source: pack.idle, frameCount: pack.idleFrames };
};
