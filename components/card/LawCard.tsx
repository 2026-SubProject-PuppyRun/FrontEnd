import { Law } from "@/constants/lawData";
import { Text, View } from "react-native";

const LawCard = (props: Law) => {
  return (
    <View className="m-2 flex-1 justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
      <View>
        <View className="mb-4 flex-row items-center justify-between">
          <View className="rounded-full bg-blue-100 px-3 py-1.5">
            <Text className="text-xs font-bold tracking-wider text-blue-700">
              {props.category}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-extrabold leading-tight text-gray-900">
          {props.title}
        </Text>

        <Text className="mt-5 text-base font-medium leading-relaxed text-gray-600">
          {props.description}
        </Text>
      </View>

      <View className="mt-6 flex-row items-start rounded-xl border border-red-100 bg-red-50 p-4">
        <Text className="mr-2 mt-0.5 text-red-500">🚨</Text>
        <View className="flex-1">
          <Text className="mb-1 text-sm font-bold text-red-800">
            위반 시 처벌 규정
          </Text>
          <Text className="text-sm font-medium leading-tight text-red-600">
            {props.penalty}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LawCard;
