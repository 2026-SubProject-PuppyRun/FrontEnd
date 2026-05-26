import PetSprite from "@/components/board/PetBoard/PetSprite";
import {
  PET_SPRITE_FOOTPRINT_HEIGHT,
  SPRITE_DISPLAY_SIZE,
} from "@/constants/petSpriteMap";
import { WanderBounds } from "@/hooks/use-pet-wander";
import { usePetStore } from "@/store/usePetStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";

const PASTURE_HEIGHT = 280;

const SKY_COLORS = ["#B8E4F5", "#D4EFF9", "#E8F6FC"] as const;
const GRASS_COLORS = ["#8FCC7A", "#6FB85A", "#5A9E48"] as const;
const HILL_COLOR = "rgba(255,255,255,0.12)";

const PastureScenery = () => (
  <>
    <LinearGradient
      colors={[...SKY_COLORS]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "48%",
      }}
    />
    <LinearGradient
      colors={[...GRASS_COLORS]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "72%",
      }}
    />
    <View
      style={{
        position: "absolute",
        right: 28,
        top: 22,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFE9A8",
        shadowColor: "#F5D76E",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 14,
        elevation: 4,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 24,
        top: 36,
        width: 52,
        height: 18,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.88)",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 88,
        top: 18,
        width: 36,
        height: 14,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.72)",
      }}
    />
    <View
      style={{
        position: "absolute",
        right: 72,
        top: 48,
        width: 28,
        height: 11,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.65)",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 52,
        height: 36,
        backgroundColor: HILL_COLOR,
        borderTopLeftRadius: 120,
        borderTopRightRadius: 80,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 38,
        height: 28,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 100,
      }}
    />
    {([12, 28, 44, 60, 76] as const).map((leftPct) => (
      <View
        key={leftPct}
        style={{
          position: "absolute",
          left: `${leftPct}%` as const,
          bottom: 12,
          width: 3,
          height: 22,
          borderRadius: 2,
          backgroundColor: "#C4A574",
          opacity: 0.9,
        }}
      />
    ))}
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 14,
        backgroundColor: "#B8956A",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 12,
        height: 3,
        backgroundColor: "#D4B88A",
      }}
    />
    {(
      [
        { left: "8%", bottom: 18 },
        { left: "22%", bottom: 14 },
        { left: "38%", bottom: 20 },
        { left: "55%", bottom: 16 },
        { left: "70%", bottom: 22 },
        { left: "85%", bottom: 15 },
      ] as const
    ).map((spot, i) => (
      <View
        key={i}
        style={{
          position: "absolute",
          left: spot.left,
          bottom: spot.bottom,
          width: 10,
          height: 6,
          borderRadius: 6,
          backgroundColor: "rgba(72, 130, 55, 0.45)",
        }}
      />
    ))}
  </>
);

const PastureBoard = () => {
  const petList = usePetStore((state) => state.petList);
  const totalPetCount = usePetStore((state) => state.totalPetCount);
  const [bounds, setBounds] = useState<WanderBounds>({ width: 0, height: 0 });

  const onPastureLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBounds({
      width: Math.max(0, width - SPRITE_DISPLAY_SIZE),
      height: Math.max(0, height - PET_SPRITE_FOOTPRINT_HEIGHT),
    });
  }, []);

  const hasPets = petList && petList.length > 0;
  const canWander = bounds.width > 0 && bounds.height > 0;
  const petCount = totalPetCount ?? petList?.length ?? 0;

  return (
    <View
      className="mb-5 overflow-hidden rounded-3xl border border-[#E6DFD3] bg-[#FFFCF7]"
      style={{
        shadowColor: "#6B5E4A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <View className="flex-row items-center justify-between border-b border-[#EDE8DF] bg-[#FAF7F2] px-4 py-3">
        <View className="flex-row items-center gap-2.5">
          <View className="rounded-2xl bg-[#E8F5E3] p-2">
            <Ionicons name="leaf" size={18} color="#5A9E48" />
          </View>
          <View>
            <Text className="text-base font-bold text-[#4A4035]">
              우리 목장
            </Text>
            <Text className="text-xs text-[#8A7F72]">
              오늘도 산책 준비 완료
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-[#7CB66A] px-3 py-1.5">
          <Ionicons name="paw" size={12} color="#fff" />
          <Text className="text-xs font-semibold text-white">
            {petCount}마리
          </Text>
        </View>
      </View>

      <View
        style={{
          height: PASTURE_HEIGHT,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <PastureScenery />

        <View
          onLayout={onPastureLayout}
          style={{
            flex: 1,
            position: "relative",
            marginBottom: 16,
          }}
        >
          {!hasPets && (
            <View className="flex-1 items-center justify-center px-6">
              <View className="mb-3 rounded-full bg-white/30 p-4">
                <Ionicons name="paw-outline" size={32} color="#fff" />
              </View>
              <Text className="text-center text-sm font-medium text-white">
                등록된 반려견이 없어요
              </Text>
              <Text className="mt-1 text-center text-xs text-white/85">
                펫을 추가하면 목장에서 뛰어놀아요!
              </Text>
            </View>
          )}

          {hasPets && !canWander && (
            <View className="flex-1 items-center justify-center">
              <Text className="text-sm font-medium text-white/90">
                목장 불러오는 중…
              </Text>
            </View>
          )}

          {hasPets &&
            canWander &&
            petList.map((pet, index) => (
              <PetSprite
                key={`${pet.petId}-${pet.breedCode}`}
                breedCode={pet.breedCode}
                petIndex={index}
                bounds={bounds}
                name={pet.name}
                accentColor={pet.color}
                onPress={() => {
                  // TODO: 펫 상세 / 케어 화면 이동
                }}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

export default PastureBoard;
