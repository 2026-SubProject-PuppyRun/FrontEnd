import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import { CheckCircleIcon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import RedButtonSurface from "../ui/RedButtonSurface";

const SelfieButton = ({ size = 100 }: { size?: number }) => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const iconSize = Math.round(size * 0.46);

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 안내", "카메라 권한이 필요합니다!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    if (!result.canceled) {
      showToast({ message: "인증샷이 저장되었습니다!", icon: CheckCircleIcon });
      useRunStore.getState().addRunData({ selfie: result.assets[0].uri });
      router.push("/running/selfie");
    }
  };
  return (
    <RedButtonSurface
      borderRadius={100}
      backgroundColor={"#F25857"}
      shadowPadding={8}
      style={{ width: size, height: size }}
    >
      <Pressable
        onPress={takeSelfie}
        className="h-full w-full items-center justify-center"
      >
        <Ionicons name="logo-instagram" size={iconSize} color="white" />
      </Pressable>
    </RedButtonSurface>
  );
};

export default SelfieButton;
