import AlarmBody from "@/components/body/AlarmBody";
import Header from "@/components/header/Header";
import { KeyboardAvoidingView, Platform, View } from "react-native";

const Alarm = () => {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="알람 설정" subtitle="산책·급여 시간을 알려드릴게요" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <AlarmBody />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Alarm;
