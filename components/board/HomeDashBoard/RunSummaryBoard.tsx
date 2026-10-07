import PetSpriteInPlace from "@/components/board/PetBoard/PetSpriteInPlace";
import { Text } from "@/components/ui/text";
import { SPRITE_DISPLAY_SIZE } from "@/constants/petSpriteMap";
import { Pet } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useWindowDimensions, View } from "react-native";

export const RUN_SUMMARY_HORIZONTAL_INSET = 48;

export type RunSummaryLayout = {
  cardHeight: number;
  photoWidth: number;
  photoHeight: number;
  spriteBoxSize: number;
  spriteScale: number;
  gap: number;
};

export const getRunSummaryLayout = (windowWidth: number): RunSummaryLayout => {
  const cardWidth = windowWidth - RUN_SUMMARY_HORIZONTAL_INSET;

  if (cardWidth >= 327) {
    return {
      cardHeight: 236,
      photoWidth: 104,
      photoHeight: 136,
      spriteBoxSize: 88,
      spriteScale: 88 / SPRITE_DISPLAY_SIZE,
      gap: 12,
    };
  }

  if (cardWidth >= 290) {
    return {
      cardHeight: 224,
      photoWidth: 88,
      photoHeight: 116,
      spriteBoxSize: 76,
      spriteScale: 76 / SPRITE_DISPLAY_SIZE,
      gap: 10,
    };
  }

  return {
    cardHeight: 216,
    photoWidth: 76,
    photoHeight: 100,
    spriteBoxSize: 68,
    spriteScale: 68 / SPRITE_DISPLAY_SIZE,
    gap: 8,
  };
};

export const RUN_SUMMARY_CARD_HEIGHT = getRunSummaryLayout(375).cardHeight;

const BOX_BORDER_COLOR = "rgba(13, 15, 27, 0.14)";

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padStart(6, "0").slice(0, 6);
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(242, 88, 87, ${alpha})`;

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getAccentTextColor = (hex: string) => {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padStart(6, "0").slice(0, 6);
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return "#F25857";

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance > 0.72) return "#B45309";

  const darken = (channel: number) => Math.max(0, Math.round(channel * 0.72));
  const toHex = (channel: number) =>
    darken(channel).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

interface RunSummaryBoardProps {
  pet: Pet;
  time: string;
  distance: string;
  pace: string;
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <View className="min-w-0 flex-1">
    <Text
      className="text-[9px] font-bold tracking-wide text-gray-500"
      numberOfLines={1}
    >
      {label}
    </Text>
    <Text
      className="mt-1 text-[14px] font-semibold text-[#0D0F1B]"
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.7}
    >
      {value}
    </Text>
  </View>
);

const RunSummaryBoard = ({
  pet,
  time,
  distance,
  pace,
}: RunSummaryBoardProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const layout = getRunSummaryLayout(windowWidth);
  const accentBg = hexToRgba(pet.color, 0.32);
  const accentText = getAccentTextColor(pet.color);
  const recordNo = pet.petId.replace(/-/g, "").slice(0, 12).toUpperCase();
  const pawIconSize = Math.round(layout.photoWidth * 0.32);

  return (
    <View
      className="h-full rounded-3xl p-1.5"
      style={{
        backgroundColor: accentBg,
        borderWidth: 1,
        borderColor: BOX_BORDER_COLOR,
      }}
    >
      <View
        className="h-full flex-col overflow-hidden rounded-2xl bg-white"
        style={{
          borderWidth: 1,
          borderColor: BOX_BORDER_COLOR,
        }}
      >
        <View
          className="flex-row items-center justify-between border-b px-4 pb-2 pt-2.5"
          style={{ borderColor: BOX_BORDER_COLOR }}
        >
          <View className="min-w-0 flex-1 pr-2">
            <Text className="text-xs font-black tracking-[1.5px] text-[#0D0F1B]">
              RECENT WALK RECORD
            </Text>
            <Text
              className="mt-0.5 text-[10px] text-gray-500"
              numberOfLines={1}
              style={{ textDecorationLine: "underline" }}
            >
              NO. {recordNo}
            </Text>
          </View>
          <Text
            className={`text-[11px] font-bold ${pet.mbti ? "text-[#D97706]" : "text-gray-400"}`}
          >
            {pet.mbti || "PUPPY"}
          </Text>
        </View>

        <View className="flex-1 justify-center px-3 py-2.5">
          <View
            className="flex-row items-stretch"
            style={{ gap: layout.gap }}
          >
            <View
              className="shrink-0 self-center overflow-hidden bg-[#F7F7F7]"
              style={{
                width: layout.photoWidth,
                height: layout.photoHeight,
                borderWidth: 1,
                borderColor: BOX_BORDER_COLOR,
              }}
            >
              {pet.profileImageUrl ? (
                <Image
                  source={{ uri: pet.profileImageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View
                  className="h-full w-full items-center justify-center"
                  style={{ backgroundColor: pet.color }}
                >
                  <Ionicons name="paw" size={pawIconSize} color="#fff" />
                </View>
              )}
            </View>

            <View
              className="min-w-0 flex-1 justify-between"
              style={{ gap: layout.gap }}
            >
              <View
                className="flex-row items-center"
                style={{ gap: layout.gap }}
              >
                <View className="min-w-0 flex-1">
                  <Text className="text-[9px] font-bold tracking-wide text-gray-500">
                    NAME
                  </Text>
                  <View
                    className="mt-1 border-b pb-0.5"
                    style={{ borderColor: "#0D0F1B" }}
                  >
                    <Text
                      className="text-[16px] font-bold"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                      style={{ color: accentText }}
                    >
                      {pet.name}
                    </Text>
                  </View>
                </View>

                <View
                  className="shrink-0 items-center justify-center overflow-hidden"
                  style={{
                    width: layout.spriteBoxSize,
                    height: layout.spriteBoxSize,
                  }}
                >
                  <PetSpriteInPlace
                    breedCode={pet.breedCode}
                    scale={layout.spriteScale}
                    contentScale={0.58}
                  />
                </View>
              </View>

              <View className="w-full flex-row" style={{ gap: layout.gap }}>
                <InfoField label="TIME" value={time} />
                <InfoField label="DISTANCE" value={distance} />
                <InfoField label="PACE" value={pace} />
              </View>
            </View>
          </View>
        </View>

        <View
          className="border-t px-4 py-1.5"
          style={{
            borderColor: BOX_BORDER_COLOR,
            backgroundColor: "#FAFAFA",
          }}
        >
          <Text className="leading-3.5 text-[9px] tracking-wide text-gray-400">
            PUPPYRUN · RECENT WALK SUMMARY · MADE FOR YOUR PUP
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RunSummaryBoard;
