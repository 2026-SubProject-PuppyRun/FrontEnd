import PetBody from "@/components/body/pet/PetBody";
import Header from "@/components/header/Header";
import { View } from "react-native";

const Index = () => {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header
        showLogo
        disableBack
        subtitle="목장에서 뛰어놀고, 건강 기록도 챙겨요"
      />
      <PetBody />
    </View>
  );
};

export default Index;
