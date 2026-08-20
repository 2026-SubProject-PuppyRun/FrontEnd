import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { BREED_DATA, BreedInfo } from "@/constants/breedData";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";

const SIZE_FILTERS = ["전체", "소형견", "중형견", "대형견", "기타"] as const;

type SizeFilter = (typeof SIZE_FILTERS)[number];

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View className="mb-3 flex-row items-start gap-3">
    <View className="mt-0.5 rounded-xl bg-[#FFF0F0] p-2">
      <Ionicons name={icon} size={14} color="#F25857" />
    </View>
    <View className="min-w-0 flex-1">
      <Text className="text-xs font-medium text-gray-500">{label}</Text>
      <Text className="mt-0.5 text-sm leading-5 text-[#0D0F1B]">{value}</Text>
    </View>
  </View>
);

const BreedCard = ({ breed }: { breed: BreedInfo }) => {
  const swatchColor =
    breed.color.toLowerCase() === "#ffffff" ||
    breed.color.toLowerCase() === "#fff"
      ? "#E5E7EB"
      : breed.color;

  return (
    <View className="mb-3 overflow-hidden rounded-3xl bg-white shadow-sm">
      <Accordion
        size="md"
        variant="unfilled"
        type="single"
        isCollapsible
        className="w-full"
      >
        <AccordionItem value={breed.code}>
          <AccordionHeader>
            <AccordionTrigger className="px-5 py-4">
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <View
                    className="mr-3 h-10 w-10 rounded-full border border-outline-200"
                    style={{ backgroundColor: swatchColor }}
                  />
                  <View className="min-w-0 flex-1">
                    <AccordionTitleText className="text-base font-semibold text-[#0D0F1B]">
                      {breed.name}
                    </AccordionTitleText>
                    <Text className="mt-0.5 text-xs text-gray-500">
                      {breed.size} · {breed.weightRange} kg
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9CA3AF"
                  />
                </>
              )}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="px-5 pb-5">
            <View className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
              <InfoRow
                icon="scale-outline"
                label="체중 범위"
                value={`${breed.weightRange} kg`}
              />
              <InfoRow
                icon="resize-outline"
                label="크기 분류"
                value={breed.size}
              />
              <InfoRow
                icon="happy-outline"
                label="성격"
                value={breed.personality}
              />
              <InfoRow
                icon="medkit-outline"
                label="유의 유전병"
                value={breed.geneticDiseases.join(", ")}
              />
              <InfoRow
                icon="walk-outline"
                label="추천 운동량"
                value={breed.recommendedExercise}
              />
            </View>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
};

const BreedGuideBody = () => {
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("전체");

  const filteredBreeds = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return BREED_DATA.filter((breed) => {
      const matchesSize =
        sizeFilter === "전체" ? true : breed.size === sizeFilter;
      const matchesQuery =
        !normalized ||
        breed.name.toLowerCase().includes(normalized) ||
        breed.personality.toLowerCase().includes(normalized);
      return matchesSize && matchesQuery;
    });
  }, [query, sizeFilter]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-4 mt-2">
        <Text className="mt-2 text-sm text-gray-500">
          우리 아이 견종의 성격과 케어 팁을 확인해보세요
        </Text>
      </View>

      <View className="mb-4 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          className="ml-2 flex-1 text-base text-[#0D0F1B]"
          placeholder="견종명을 검색해보세요"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {SIZE_FILTERS.map((size) => {
          const isActive = sizeFilter === size;
          return (
            <Pressable
              key={size}
              onPress={() => setSizeFilter(size)}
              className={`rounded-full px-4 py-2 ${
                isActive ? "bg-[#F25857]" : "bg-white"
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {size}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text className="mb-3 text-xs font-medium text-gray-500">
        {filteredBreeds.length}종의 견종
      </Text>

      {filteredBreeds.length === 0 ? (
        <View className="items-center rounded-3xl bg-white px-6 py-12 shadow-sm">
          <View className="mb-3 rounded-full bg-[#F7F7F7] p-4">
            <Ionicons name="paw-outline" size={28} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-[#0D0F1B]">
            검색 결과가 없어요
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            다른 키워드나 크기 필터로 다시 찾아보세요
          </Text>
        </View>
      ) : (
        filteredBreeds.map((breed) => (
          <BreedCard key={breed.code} breed={breed} />
        ))
      )}
    </ScrollView>
  );
};

export default BreedGuideBody;
