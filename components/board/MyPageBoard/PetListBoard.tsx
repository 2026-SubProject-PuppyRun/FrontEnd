import { usePetStore } from "@/store/usePetStore";
import { View } from "react-native";
import PetListBoardItem from "./PetListBoardItem";

const PetListBoard = () => {
  const petList = usePetStore((state) => state.petList);
  return (
    <View className="mb-4 gap-2">
      {petList && petList.map((pet) => (
        <PetListBoardItem
          key={pet.petId}
          petImgUrl={pet.profileImageUrl || ""}
          petName={pet.name}
          petId={pet.petId}
        />
      ))}
    </View>
  );
};

export default PetListBoard;
