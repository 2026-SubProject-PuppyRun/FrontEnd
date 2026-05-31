import PetForm from "@/components/form/PetForm";
import { Pet, usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const Edit = () => {
  const { petId } = useLocalSearchParams();

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === petId),
  ) as Pet;

  return (
    <View className="flex-1 ">
      <PetForm
        initialData={pet}
        onSubmit={(data) => {
          console.log("수정된 반려견 정보:", data);
          //TODO: 수정된 반려견 정보를 서버에 저장하는 로직 추가
        }}
      />
    </View>
  );
};

export default Edit;
