import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

const EditPet = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Hello, World! {id}</Text>
    </View>
  );
};

export default EditPet;
