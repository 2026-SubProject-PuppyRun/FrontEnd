import { ImageSourcePropType } from "react-native";

export const SPRITE_FRAME_WIDTH = 100;
export const SPRITE_FRAME_HEIGHT = 100;

export const SPRITE_DISPLAY_SIZE = 140;

/** PNG 하단 투명 여백 보정 — 이름표를 발 밑에 붙임 */
export const SPRITE_NAME_TAG_TOP = Math.round(SPRITE_DISPLAY_SIZE * 0.72);
export const SPRITE_NAME_TAG_HEIGHT = 18;
/** 배회 영역 계산용 (스프라이트 + 이름표 실제 높이) */
export const PET_SPRITE_FOOTPRINT_HEIGHT =
  SPRITE_NAME_TAG_TOP + SPRITE_NAME_TAG_HEIGHT;

export type SpritePackKey =
  | "goldenRetriever"
  | "akita"
  | "greatDane"
  | "schnauzer"
  | "saintBernard"
  | "siberianHusky";

export type SpriteAction = "walk" | "idle";

export interface SpritePack {
  walk: ImageSourcePropType;
  idle: ImageSourcePropType;
  walkFrames: number;
  idleFrames: number;
}

export const DEFAULT_SPRITE_PACK: SpritePackKey = "goldenRetriever";

export const SPRITE_PACKS: Record<SpritePackKey, SpritePack> = {
  goldenRetriever: {
    walk: require("@/assets/sprites/pets/golden-retriever/walk.png"),
    idle: require("@/assets/sprites/pets/golden-retriever/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
  akita: {
    walk: require("@/assets/sprites/pets/akita/walk.png"),
    idle: require("@/assets/sprites/pets/akita/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
  greatDane: {
    walk: require("@/assets/sprites/pets/great-dane/walk.png"),
    idle: require("@/assets/sprites/pets/great-dane/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
  schnauzer: {
    walk: require("@/assets/sprites/pets/schnauzer/walk.png"),
    idle: require("@/assets/sprites/pets/schnauzer/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
  saintBernard: {
    walk: require("@/assets/sprites/pets/saint-bernard/walk.png"),
    idle: require("@/assets/sprites/pets/saint-bernard/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
  siberianHusky: {
    walk: require("@/assets/sprites/pets/siberian-husky/walk.png"),
    idle: require("@/assets/sprites/pets/siberian-husky/idle.png"),
    walkFrames: 8,
    idleFrames: 10,
  },
};

/**
 * breedCode → 스프라이트 팩 (Pet Dogs Pack 6종 + 근사·폴백)
 * @see constants/breedData.ts
 */
export const BREED_SPRITE_MAP: Record<string, SpritePackKey> = {
  /** 골든 리트리버 — Dog-1 */
  "301": "goldenRetriever",
  "302": "goldenRetriever",
  "203": "akita",
  "201": "akita",
  "207": "akita",
  "109": "schnauzer",
  "106": "schnauzer",
  "304": "siberianHusky",
  "303": "siberianHusky",
  "305": "siberianHusky",
  "204": "siberianHusky",
  "306": "greatDane",
  "307": "saintBernard",
  "202": "goldenRetriever",
  "206": "goldenRetriever",
  /** 소형견 — 팩에 없어 비슷한 체형으로 대체 (말티즈 등) */
  "101": "akita",
  "107": "akita",
  "208": "akita",
  "103": "akita",
  "110": "akita",
  "105": "akita",
  "104": "schnauzer",
  "108": "greatDane",
  "205": "schnauzer",
  "000": "goldenRetriever",
};
