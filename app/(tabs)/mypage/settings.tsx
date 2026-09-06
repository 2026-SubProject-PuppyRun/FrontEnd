import SettingBody from "@/components/body/mypage/SettingBody";
import Header from "@/components/header/Header";
import { View } from "react-native";

const Settings = () => {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="설정" />
      <SettingBody />
    </View>
  );
};

export default Settings;
