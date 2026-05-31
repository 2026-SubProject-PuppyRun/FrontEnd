import Header from "@/components/header/Header";
import { Pressable } from "@/components/ui/pressable";
import { usePetStore } from "@/store/usePetStore";
import {
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const resolvePetId = (
  value: string | string[] | undefined,
): string | undefined => {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export default function PetLayout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ petId: string }>();
  const petId = resolvePetId(params.petId);
  const petList = usePetStore((state) => state.petList);
  const petName = petList?.find((p) => p.petId === petId)?.name;
  const path = usePathname();
  const isEdit = path.includes("edit");
  return (
    <View className="flex-1 bg-white">
      <Header title={petName ?? "반려견"}>
        {petId && !isEdit ? (
          <Pressable
            onPress={() => router.push(`/care/pets/${petId}/edit`)}
            className="px-2 py-1"
          >
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              수정하기
            </Text>
          </Pressable>
        ) : null}
      </Header>
      <View className="flex-1">
        {!petList ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : !petName ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-gray-500">
              반려견 정보를 찾을 수 없어요.
            </Text>
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="edit" options={{ headerShown: false }} />
          </Stack>
        )}
      </View>
    </View>
  );
}
