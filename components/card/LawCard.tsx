import { Text } from "@/components/ui/text";
import { Law } from "@/constants/lawData";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const LawCard = (props: Law) => {
  return (
    <View className="mb-3 rounded-3xl bg-white px-5 py-5 shadow-sm">
      <View className="mb-3 self-start rounded-full bg-[#FFF0F0] px-3 py-1">
        <Text className="text-xs font-semibold text-[#F25857]">
          {props.category}
        </Text>
      </View>

      <Text className="text-lg font-bold leading-6 text-[#0D0F1B]">
        {props.title}
      </Text>

      <Text className="mt-3 text-sm leading-6 text-gray-600">
        {props.description}
      </Text>

      <View className="mt-4 rounded-2xl bg-[#FFF0F0] px-4 py-3.5">
        <View className="mb-1.5 flex-row items-center gap-1.5">
          <Ionicons name="alert-circle" size={16} color="#F25857" />
          <Text className="text-sm font-semibold text-[#F25857]">
            위반 시 처벌 규정
          </Text>
        </View>
        <Text className="text-sm leading-5 text-[#0D0F1B]">{props.penalty}</Text>
      </View>
    </View>
  );
};

export default LawCard;
