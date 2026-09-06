import { usePetStore } from "@/store/usePetStore";
import { View } from "react-native";
import PetListBoardItem from "./PetListBoardItem";

const PetListBoard = () => {
  const petList = usePetStore((state) => state.petList);

  return (
    <View>
      {petList?.map((pet) => (
        <PetListBoardItem key={pet.petId} {...pet} />
      ))}
    </View>
  );
};

export default PetListBoard;
