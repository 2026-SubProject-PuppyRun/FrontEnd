import PetBody from "@/components/body/mypage/PetBody";
import Header, { HeaderIconButton } from "@/components/header/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header
        title="반려견 관리"
        right={
          <HeaderIconButton
            onPress={() => router.push("/mypage/pets/create")}
            accessibilityLabel="반려견 추가"
          >
            <Ionicons name="add" size={26} color="#0D0F1B" />
          </HeaderIconButton>
        }
      />
      <PetBody />
    </View>
  );
};

export default Index;
