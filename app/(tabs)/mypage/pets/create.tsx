import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import { View } from "react-native";

const Create = () => {
  return (
    <View className="flex-1">
      <Header title="반려동물 등록" />
      <PetForm onSubmit={() => console.log("반려견 추가 전송")} />
    </View>
  );
};

export default Create;
