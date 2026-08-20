import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRunStore } from "@/store/useRunStore";
import { ApiError } from "@/util/api";
import { submitWalkTracking } from "@/util/run/submitWalkTracking";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { CheckCircleIcon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import RedButtonSurface from "../ui/RedButtonSurface";

const SelfieButton = ({ size = 100 }: { size?: number }) => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [isSaving, setIsSaving] = useState(false);
  const iconSize = Math.round(size * 0.46);

  const takeSelfie = async () => {
    if (isSaving) return;

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

    if (result.canceled) return;

    const selfieUri = result.assets[0].uri;
    useRunStore.getState().addRunData({ selfie: selfieUri });

    try {
      setIsSaving(true);
      console.log("[SelfieButton] submitWalkTracking 호출");
      await submitWalkTracking(selfieUri);
      console.log("[SelfieButton] submitWalkTracking 완료");
      showToast({
        message: "산책 기록이 저장되었습니다!",
        icon: CheckCircleIcon,
      });
      router.push("/running/selfie");
    } catch (error) {
      console.error("산책 기록 저장 실패:", error);
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "산책 기록 저장에 실패했습니다. 다시 시도해 주세요.";
      Alert.alert("저장 실패", message);
      // 셀피는 남기고 화면은 진입 — 일기/재시도 가능
      router.push("/running/selfie");
    } finally {
      setIsSaving(false);
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
        disabled={isSaving}
        className="h-full w-full items-center justify-center"
        style={({ pressed }) =>
          pressed || isSaving ? { opacity: 0.85 } : undefined
        }
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Ionicons name="logo-instagram" size={iconSize} color="white" />
        )}
      </Pressable>
    </RedButtonSurface>
  );
};

export default SelfieButton;
