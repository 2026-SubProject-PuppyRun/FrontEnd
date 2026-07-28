import MbtiBody from "@/components/body/mypage/MbtiBody";
import Header from "@/components/header/Header";
import { usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const Mbti = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === id),
  );
  const petName = pet?.name ?? "우리 아이";

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header
        title="멍BTI 검사"
        subtitle={`${petName}의 성격을 알아볼까요?`}
        subtitleAlign="center"
      />
      <MbtiBody petId={id} petName={petName} />
    </View>
  );
};

export default Mbti;
