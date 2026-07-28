import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import { KeyboardAvoidingView, Platform, View } from "react-native";

const Create = () => {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="반려견 추가" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm
          onSubmit={(data) => {
            console.log("반려견 추가 전송", data);
            // TODO: 반려견 추가 전송 이후 API 재요청하여 반려견 목록 업데이트
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Create;
