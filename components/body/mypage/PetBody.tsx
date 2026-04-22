import PetListBoard from "@/components/board/MyPageBoard/PetListBoard";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

const PetBody = () => {
  const router = useRouter();
  return (
    <ScrollView className="p-4">
      <PetListBoard />
      <Button
        className="rounded-lg"
        onPress={() => router.push("/mypage/pets/create")}
      >
        <ButtonText>+</ButtonText>
      </Button>
    </ScrollView>
  );
};

export default PetBody;
