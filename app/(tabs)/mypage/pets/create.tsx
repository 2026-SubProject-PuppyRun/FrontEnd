import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import { View } from "react-native";

const Create = () => {
  return (
    <View className="flex-1">
      <Header title="반려동물 등록" />
      <PetForm
        onSubmit={(data) => {
          console.log("반려견 추가 전송", data);
          // TODO: 반려견 추가 전송 이후 API 재요청하여 반려견 목록 업데이트
        }}
      />
    </View>
  );
};

export default Create;
