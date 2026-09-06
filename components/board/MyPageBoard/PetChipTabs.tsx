import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, View } from "react-native";

export type PetChipItem = {
  petId: string;
  name: string;
  profileImageUrl: string | null;
  color?: string;
};

type PetChipTabsProps = {
  pets: PetChipItem[];
  selectedPetId: string;
  onSelect: (petId: string) => void;
};

const PetChipTabs = ({ pets, selectedPetId, onSelect }: PetChipTabsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="gap-2 pb-1"
    className="mb-4"
  >
    {pets.map((pet) => {
      const isActive = pet.petId === selectedPetId;

      return (
        <Pressable
          key={pet.petId}
          onPress={() => onSelect(pet.petId)}
          className={`flex-row items-center rounded-full border px-3 py-2 ${
            isActive
              ? "border-[#F25857] bg-[#FFF3F3]"
              : "border-[#ECECF0] bg-[#F7F7F7]"
          }`}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <View
            className="mr-2 h-7 w-7 overflow-hidden rounded-full"
            style={{ backgroundColor: pet.color || "#E8E8ED" }}
          >
            {pet.profileImageUrl ? (
              <Image
                source={{ uri: pet.profileImageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Ionicons name="paw" size={14} color="#fff" />
              </View>
            )}
          </View>
          <Text
            className={`text-sm font-semibold ${
              isActive ? "text-[#F25857]" : "text-gray-500"
            }`}
          >
            {pet.name}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

export default PetChipTabs;
