import PetSpriteInPlace from "@/components/board/PetBoard/PetSpriteInPlace";
import { Text } from "@/components/ui/text";
import { Pet } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View } from "react-native";

export const RUN_SUMMARY_CARD_HEIGHT = 228;

const PHOTO_WIDTH = 100;
const PHOTO_HEIGHT = 132;
const DOT_SIZE = 92;
const SPRITE_SCALE = 0.85;
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
    <Text className="text-[10px] font-bold tracking-wide text-[#0D0F1B]">
      {label}
    </Text>
    <Text
      className="mt-1 text-[15px] font-semibold text-[#0D0F1B]"
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
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
  const accentBg = hexToRgba(pet.color, 0.32);
  const accentText = getAccentTextColor(pet.color);
  const recordNo = pet.petId.replace(/-/g, "").slice(0, 12).toUpperCase();

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
          className="flex-row items-center justify-between border-b px-4 pb-2.5 pt-3"
          style={{ borderColor: BOX_BORDER_COLOR }}
        >
          <View className="min-w-0 flex-1 pr-2">
            <Text className="text-xs font-black tracking-[1.5px] text-[#0D0F1B]">
              WALK RECORD
            </Text>
            <Text
              className="mt-1 text-[10px] text-gray-500"
              numberOfLines={1}
              style={{ textDecorationLine: "underline" }}
            >
              NO. {recordNo}
            </Text>
          </View>
          <Text className="text-[11px] font-bold text-gray-400">PUPPY</Text>
        </View>

        <View className="flex-1 justify-center px-3 py-3">
          <View className="flex-row items-start gap-3">
            <View
              className="shrink-0 overflow-hidden bg-[#F7F7F7]"
              style={{
                width: PHOTO_WIDTH,
                height: PHOTO_HEIGHT,
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
                  <Ionicons name="paw" size={32} color="#fff" />
                </View>
              )}
            </View>

            <View className="min-w-0 flex-1 gap-3">
              <View className="flex-row gap-3">
                <InfoField label="WALK TIME" value={time} />
                <InfoField label="DISTANCE" value={distance} />
              </View>
              <View className="flex-row items-end gap-3">
                <InfoField label="AVG PACE" value={pace} />
                <View className="min-w-0 flex-1">
                  <Text className="text-[10px] font-bold tracking-wide text-[#0D0F1B]">
                    NAME
                  </Text>
                  <View
                    className="mt-1 w-40 border-b pb-0.5"
                    style={{ borderColor: "#0D0F1B" }}
                  >
                    <Text
                      className="text-[15px] font-bold text-[#0D0F1B]"
                      numberOfLines={1}
                      style={{ color: accentText }}
                    >
                      {pet.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              className="shrink-0 items-center justify-center self-end overflow-hidden"
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
              }}
            >
              <PetSpriteInPlace
                breedCode={pet.breedCode}
                scale={SPRITE_SCALE}
              />
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
