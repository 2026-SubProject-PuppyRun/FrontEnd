import PetChipTabs from "@/components/board/MyPageBoard/PetChipTabs";
import WalkGradePanel from "@/components/board/MyPageBoard/WalkGradePanel";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Text } from "@/components/ui/text";
import { usePetStore } from "@/store/usePetStore";
import { usePetProgressQuery } from "@/util/api/pets";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

const UserBoard = () => {
  const router = useRouter();
  const petList = usePetStore((state) => state.petList);
  const hasPets = (petList?.length ?? 0) > 0;
  const petColorMap = useMemo(
    () =>
      Object.fromEntries(
        (petList ?? []).map((pet) => [pet.petId, pet.color]),
      ),
    [petList],
  );

  const { data: progresses = [], isLoading, isError } = usePetProgressQuery({
    enabled: hasPets,
  });
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    if (!progresses.length) {
      setSelectedPetId(null);
      return;
    }

    const hasSelected = progresses.some((item) => item.petId === selectedPetId);
    if (!hasSelected) {
      setSelectedPetId(progresses[0].petId);
    }
  }, [progresses, selectedPetId]);

  const chipItems = useMemo(
    () =>
      progresses.map((item) => ({
        petId: item.petId,
        name: item.name,
        profileImageUrl: item.profileImageUrl,
        color: petColorMap[item.petId],
      })),
    [progresses, petColorMap],
  );

  const selectedProgress =
    progresses.find((item) => item.petId === selectedPetId) ??
    progresses[0] ??
    null;

  return (
    <View className="mx-2 mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
      {isLoading && hasPets ? (
        <ChartSkeleton />
      ) : isError ? (
        <View className="py-2">
          <Text className="text-center text-sm text-gray-500">
            산책 등급을 불러오지 못했어요.
          </Text>
        </View>
      ) : (
        <>
          {chipItems.length > 1 && selectedPetId ? (
            <PetChipTabs
              pets={chipItems}
              selectedPetId={selectedPetId}
              onSelect={setSelectedPetId}
            />
          ) : null}

          {selectedProgress ? (
            <WalkGradePanel progress={selectedProgress} />
          ) : (
            <View className="py-2">
              <Text className="text-center text-base font-semibold text-[#0D0F1B]">
                산책 등급
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                반려견을 등록하고 산책 등급을 확인해보세요
              </Text>
            </View>
          )}
        </>
      )}

      <View className="mt-5">
        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 52 }}
        >
          <Pressable
            onPress={() => router.push("/mypage/pets")}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-base font-semibold text-white">
              반려견 관리
            </Text>
          </Pressable>
        </RedButtonSurface>
      </View>
    </View>
  );
};

export default UserBoard;
