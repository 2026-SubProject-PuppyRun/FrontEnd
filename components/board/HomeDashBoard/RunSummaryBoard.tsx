import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

interface RunSummaryBoardProps {
  imgUrl: string;
  name: string;
  time: string;
  distance: string;
  pace: string;
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View className="min-w-0 flex-1 items-center px-1">
    <Text
      className="text-center text-base font-bold text-[#0D0F1B]"
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
    >
      {value}
    </Text>
    <Text className="mt-1.5 text-center text-[11px] text-gray-500">{label}</Text>
  </View>
);

const RunSummaryBoard: React.FC<RunSummaryBoardProps> = ({
  imgUrl,
  name,
  time,
  distance,
  pace,
}) => {
  return (
    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
      <View className="flex-row items-center gap-3.5">
        <View className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#F7F7F7] bg-[#F1F5F9]">
          <Image
            source={{ uri: imgUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-medium text-gray-500">
            함께 달린 친구
          </Text>
          <Text
            className="mt-0.5 text-lg font-bold text-[#0D0F1B]"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-stretch rounded-2xl bg-[#F7F7F7] px-2 py-4">
        <StatItem label="산책 시간" value={time} />
        <View className="my-1 w-px bg-gray-200" />
        <StatItem label="산책 거리" value={distance} />
        <View className="my-1 w-px bg-gray-200" />
        <StatItem label="평균 페이스" value={pace} />
      </View>
    </View>
  );
};

export default RunSummaryBoard;
