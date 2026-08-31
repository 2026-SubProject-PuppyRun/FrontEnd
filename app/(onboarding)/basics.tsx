import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, CheckIcon, CircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";

const INPUT_TEXT_COLOR = { color: "#0D0F1B" } as const;

const Basics = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const name = useOnboardingStore((s) => s.name);
  const profileImage = useOnboardingStore((s) => s.profileImage);
  const gender = useOnboardingStore((s) => s.gender);
  const birthDate = useOnboardingStore((s) => s.birthDate);
  const setField = useOnboardingStore((s) => s.setField);

  const birthLabel = birthDate?.trim()
    ? new Date(birthDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "날짜를 선택하세요";

  const isBirthUnknown = !birthDate?.trim();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast({
        message: "사진 라이브러리 접근 권한이 필요합니다.",
        icon: AlertCircleIcon,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setField("profileImage", result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showToast({
        message: "카메라 접근 권한이 필요합니다.",
        icon: AlertCircleIcon,
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setField("profileImage", result.assets[0].uri);
    }
  };

  const handleNext = () => {
    setHasSubmitted(true);

    if (!profileImage) {
      showToast({
        message: "반려견 사진을 등록해주세요.",
        icon: AlertCircleIcon,
      });
      return;
    }

    if (!name.trim() || !gender) {
      return;
    }

    router.push("/(onboarding)/profile");
  };

  return (
    <>
      <OnboardingScreen
        step={1}
        title={"우리 아이를\n소개해 주세요"}
        subtitle="이름과 사진, 기본 정보만 먼저 알려주시면 됩니다"
        ctaLabel="다음"
        onCtaPress={handleNext}
      >
        <View className="mb-4 items-center rounded-3xl bg-white px-5 py-6">
          <Text className="mb-4 text-sm font-semibold text-gray-500">
            프로필 사진
          </Text>
          <Pressable onPress={() => setShowActionsheet(true)}>
            <View className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#F25857]/35 bg-[#F1F5F9]">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                </View>
              )}
            </View>
          </Pressable>
          <Text className="mt-3 text-sm text-gray-500">
            탭하여 사진을 추가해주세요
          </Text>
        </View>

        <View className="gap-4 rounded-3xl bg-white px-5 py-4">
          <FormControl isInvalid={hasSubmitted && !name.trim()}>
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              이름
            </FormControlLabelText>
            <Input
              size="md"
              variant="underlined"
              className="border-outline-200"
            >
              <InputField
                placeholder="이름을 입력해주세요"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChange={(e) => setField("name", e.nativeEvent.text)}
                style={INPUT_TEXT_COLOR}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>이름을 입력해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={hasSubmitted && !gender}>
            <FormControlLabelText className="mb-2 text-sm font-semibold text-gray-500">
              성별
            </FormControlLabelText>
            <RadioGroup
              value={gender}
              onChange={(value) => setField("gender", value as "F" | "M")}
            >
              <HStack space="md">
                <Radio value="M" size="md">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel className="text-[#0D0F1B] data-[checked=true]:text-primary-500">
                    수컷
                  </RadioLabel>
                </Radio>
                <Radio value="F" size="md">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel className="text-[#0D0F1B] data-[checked=true]:text-primary-500">
                    암컷
                  </RadioLabel>
                </Radio>
              </HStack>
            </RadioGroup>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>성별을 선택해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl>
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              생년월일
            </FormControlLabelText>
            <HStack className="items-center gap-3">
              <Pressable
                className="flex-1"
                onPress={() => setDateModalOpen(true)}
                disabled={isBirthUnknown}
              >
                <View className="border-b border-outline-200 pb-2 pt-2">
                  <Text
                    style={{
                      color: isBirthUnknown ? "#9CA3AF" : "#0D0F1B",
                    }}
                    className="text-base"
                  >
                    {isBirthUnknown ? "모름" : birthLabel}
                  </Text>
                </View>
              </Pressable>

              <DatePicker
                modal
                open={dateModalOpen}
                date={birthDate?.trim() ? new Date(birthDate) : new Date()}
                mode="date"
                locale="ko"
                title="생년월일 선택"
                confirmText="확인"
                cancelText="취소"
                maximumDate={new Date()}
                onConfirm={(date) => {
                  setDateModalOpen(false);
                  setField("birthDate", date.toISOString().split("T")[0]);
                }}
                onCancel={() => setDateModalOpen(false)}
              />

              <Checkbox
                size="md"
                value="unknown"
                isChecked={isBirthUnknown}
                onChange={(isChecked) => {
                  setField("birthDate", isChecked ? null : "");
                }}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="text-[#0D0F1B]">모름</CheckboxLabel>
              </Checkbox>
            </HStack>
          </FormControl>
        </View>
      </OnboardingScreen>

      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              setShowActionsheet(false);
              void pickImage();
            }}
          >
            <ActionsheetItemText>앨범에서 가져오기</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              setShowActionsheet(false);
              void takePhoto();
            }}
          >
            <ActionsheetItemText>촬영하기</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default Basics;
