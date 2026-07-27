import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const UserBoard = () => {
  const router = useRouter();

  return (
    <View className="mx-2 mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
      <Text className="text-center text-xl font-bold text-[#0D0F1B]">
        마라토너
      </Text>
      <Text className="mt-1 text-center text-sm text-gray-500">
        다음 등급까지 54% 남았어요
      </Text>

      <View className="mt-4">
        <Progress className="h-2.5 w-full" size="sm" value={46}>
          <ProgressFilledTrack className="rounded-full bg-primary-500" />
        </Progress>
        <View className="mt-1 flex-row justify-between">
          <Text className="text-xs text-gray-400">Lv.3</Text>
          <Text className="text-xs font-semibold text-primary-500">46%</Text>
          <Text className="text-xs text-gray-400">Lv.4</Text>
        </View>
      </View>

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
