import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import { Pet, usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";

const Edit = () => {
  const { id } = useLocalSearchParams();

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === id),
  ) as Pet;

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="반려견 정보 수정" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm
          initialData={pet}
          onSubmit={(data) => {
            console.log("수정된 반려견 정보:", data);
            // TODO: 수정된 반려견 정보를 서버에 저장하는 로직 추가
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Edit;
