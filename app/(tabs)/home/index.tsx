import HomeDashBoard from "@/components/board/HomeDashBoard/HomeDashBoard";
import Header from "@/components/header/Header";
import { useNotificationConsentPrompt } from "@/hooks/use-notification-consent-prompt";
import { Text, View } from "react-native";

const Index = () => {
  useNotificationConsentPrompt();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header showLogo disableBack />

      <View className="px-6 pb-3">
        <Text className="text-xl font-bold text-[#0D0F1B]">오늘의 산책</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          날씨와 산책 기록을 한눈에 확인해보세요
        </Text>
      </View>

      <HomeDashBoard />
    </View>
  );
};

export default Index;
