import LawCard from "@/components/card/LawCard";
import { Text } from "@/components/ui/text";
import { LawList } from "@/constants/lawData";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";

const CATEGORIES = [
  "전체",
  ...Array.from(new Set(LawList.map((law) => law.category))),
] as const;

const LawBody = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("전체");

  const filteredLaws = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return LawList.filter((law) => {
      const matchesCategory =
        category === "전체" ? true : law.category === category;
      const matchesQuery =
        !normalized ||
        law.title.toLowerCase().includes(normalized) ||
        law.description.toLowerCase().includes(normalized) ||
        law.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-4 mt-2">
        <Text className="mt-2 text-sm text-gray-500">
          반려견과 함께할 때 꼭 알아두어야 할 규정이에요
        </Text>
      </View>

      <View className="mb-4 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          className="ml-2 flex-1 text-base text-[#0D0F1B]"
          placeholder="법률 키워드를 검색해보세요"
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
        {CATEGORIES.map((item) => {
          const isActive = category === item;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
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
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text className="mb-3 text-xs font-medium text-gray-500">
        {filteredLaws.length}개의 규정
      </Text>

      {filteredLaws.length === 0 ? (
        <View className="items-center rounded-3xl bg-white px-6 py-12 shadow-sm">
          <View className="mb-3 rounded-full bg-[#F7F7F7] p-4">
            <Ionicons name="document-text-outline" size={28} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-[#0D0F1B]">
            검색 결과가 없어요
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            다른 키워드나 카테고리로 다시 찾아보세요
          </Text>
        </View>
      ) : (
        filteredLaws.map((law) => <LawCard key={law.id} {...law} />)
      )}
    </ScrollView>
  );
};

export default LawBody;
