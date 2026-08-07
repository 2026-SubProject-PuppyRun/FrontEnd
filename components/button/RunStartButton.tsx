import CustomAlert from "@/components/modal/CustomAlert";
import ConvexShadowSurface from "@/components/ui/ConvexShadowSurface";
import { Text } from "@/components/ui/text";
import { RED_BUTTON_EFFECT } from "@/constants/redButtonEffect";
import { usePetStore } from "@/store/usePetStore";
import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

interface RunStartButtonProps {
  disabled: boolean;
}

const RunStartButton = ({ disabled }: RunStartButtonProps) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [pickedPetIds, setPickedPetIds] = useState<string[]>([]);
  const selectedRoute = useRunStore((state) => state.selectedRoute);
  const setSelectedPetIds = useRunStore((state) => state.setSelectedPetIds);
  const petList = usePetStore((state) => state.petList) ?? [];
  const router = useRouter();

  const openStartDialog = () => {
    setPickedPetIds(petList.map((pet) => pet.petId));
    setShowAlertDialog(true);
  };

  const togglePet = (petId: string) => {
    setPickedPetIds((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId],
    );
  };

  const canStart = petList.length > 0 && pickedPetIds.length > 0;

  if (disabled) return null;

  return (
    <>
      <View className="bottom-safe-offset-40 absolute left-0 right-0 z-20 flex-row items-center justify-center overflow-visible">
        <ConvexShadowSurface
          shadowPadding={8}
          className="-m-2"
          style={{ width: 100, height: 100 }}
          borderRadius={50}
          backgroundColor={RED_BUTTON_EFFECT.fill}
        >
          <Pressable
            onPress={openStartDialog}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="산책 시작"
          >
            <Ionicons name="play" size={47} color="white" className="pl-1" />
          </Pressable>
        </ConvexShadowSurface>
      </View>

      <CustomAlert
        showAlertDialog={showAlertDialog}
        handleClose={() => setShowAlertDialog(false)}
        title="산책을 시작해볼까요?"
        confirmDisabled={!canStart}
        onConfirm={() => {
          setSelectedPetIds(pickedPetIds);
          router.replace("/running/tracking");
        }}
        confirmText="시작하기"
        cancelText="그만두기"
      >
        <View className="gap-4">
          <View className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
            <Text className="text-sm leading-5 text-gray-500">
              {selectedRoute !== null
                ? "해당 경로로 안내를 시작합니다."
                : "추천 경로 없이 산책을 시작합니다."}
            </Text>
          </View>

          <View>
            <Text className="mb-2 text-sm font-semibold text-[#0D0F1B]">
              함께할 반려견
            </Text>
            <Text className="mb-3 text-xs text-gray-400">
              산책에 참여할 아이를 선택해 주세요
            </Text>

            {petList.length === 0 ? (
              <View className="items-center rounded-2xl bg-[#FFF0F0] px-4 py-6">
                <Ionicons name="paw-outline" size={28} color="#F25857" />
                <Text className="mt-2 text-center text-sm text-gray-600">
                  등록된 반려견이 없어요
                </Text>
                <Pressable
                  onPress={() => {
                    setShowAlertDialog(false);
                    router.push("/mypage/pets/create");
                  }}
                  className="mt-3"
                >
                  <Text className="text-sm font-semibold text-[#F25857]">
                    반려견 등록하기
                  </Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                style={{ maxHeight: 220 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-2">
                  {petList.map((pet) => {
                    const selected = pickedPetIds.includes(pet.petId);
                    return (
                      <Pressable
                        key={pet.petId}
                        onPress={() => togglePet(pet.petId)}
                        className={`flex-row items-center gap-3 rounded-2xl border px-3 py-3 ${
                          selected
                            ? "border-[#F25857] bg-[#FFF0F0]"
                            : "border-transparent bg-[#F7F7F7]"
                        }`}
                        style={({ pressed }) =>
                          pressed ? { opacity: 0.85 } : undefined
                        }
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={`${pet.name} 선택`}
                      >
                        <View
                          className="h-12 w-12 overflow-hidden rounded-full border-2 bg-[#F1F5F9]"
                          style={{ borderColor: pet.color || "#E5E7EB" }}
                        >
                          {pet.profileImageUrl ? (
                            <Image
                              source={{ uri: pet.profileImageUrl }}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                            />
                          ) : (
                            <View
                              className="h-full w-full items-center justify-center"
                              style={{ backgroundColor: pet.color || "#F25857" }}
                            >
                              <Ionicons name="paw" size={20} color="#fff" />
                            </View>
                          )}
                        </View>

                        <Text className="flex-1 text-base font-semibold text-[#0D0F1B]">
                          {pet.name}
                        </Text>

                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full ${
                            selected ? "bg-[#F25857]" : "border border-gray-300"
                          }`}
                        >
                          {selected ? (
                            <Ionicons name="checkmark" size={14} color="#fff" />
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </CustomAlert>
    </>
  );
};

export default RunStartButton;
