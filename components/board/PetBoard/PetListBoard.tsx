import { usePetStore } from "@/store/usePetStore";
import { View } from "react-native";
import PetListBoardItem from "./PetListBoardItem";

const PetListBoard = () => {
  const petList = usePetStore((state) => state.petList);

  return (
    <View>
      {petList &&
        petList.map((pet) => (
          <PetListBoardItem
            key={pet.petId}
            petId={pet.petId}
            name={pet.name}
            breedCode={pet.breedCode}
            birthYear={pet.birthYear}
            profileImageUrl={pet.profileImageUrl}
          />
        ))}
    </View>
  );
};

export default PetListBoard;
