import { useRunStore } from "@/store/useRunStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text } from "react-native";
import { Button } from "../ui/button";
import { Divider } from "../ui/divider";
import { CheckCircleIcon, Icon } from "../ui/icon";
import { Toast, ToastTitle, useToast } from "../ui/toast";

const SelfieButton = () => {
  const router = useRouter();
  const toast = useToast();

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
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast
              nativeID={toastId}
              className="flex-row items-center gap-4 bg-primary-300 px-5 py-3 shadow-soft-1"
            >
              <Icon as={CheckCircleIcon} size="xl" className="text-green-500" />
              <Divider
                orientation="vertical"
                className="h-[30px] bg-outline-200"
              />
              <ToastTitle size="sm">사진이 저장되었습니다!</ToastTitle>
            </Toast>
          );
        },
      });
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
