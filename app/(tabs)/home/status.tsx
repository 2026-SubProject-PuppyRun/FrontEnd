import ChartBoardBody from "@/components/board/ChartBoard/ChartIBoardBody";
import Header from "@/components/header/Header";
import { View } from "react-native";

const Status = () => {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header
        title="산책 통계"
        subtitle="주간·월간·연간 산책 기록을 확인해보세요"
      />
      <ChartBoardBody />
    </View>
  );
};

export default Status;
