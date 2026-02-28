import { useRunStore } from "@/store/useRunStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text } from "react-native";
import { Button } from "../ui/button";

const SelfieButton = () => {
  const router = useRouter();

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 안내", "카메라 권한이 필요합니다!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert("인증샷이 저장되었습니다!");
      useRunStore.getState().addRunData({ selfie: result.assets[0].uri });
      router.push("/running/selfie");
    }
  };
  return (
    <Button className="w-4/6 self-center" onPress={takeSelfie}>
      <Text>인증샷 촬영하기</Text>
    </Button>
  );
};

export default SelfieButton;
