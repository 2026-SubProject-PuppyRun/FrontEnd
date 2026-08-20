import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BREED_DATA } from "@/constants/breedData";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { getBreedDefaultColor } from "@/util/pet";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { runOnJS } from "react-native-reanimated";
import ColorPicker, {
  HueSlider,
  Panel1,
  Swatches,
} from "reanimated-color-picker";

const INPUT_TEXT_COLOR = { color: "#0D0F1B" } as const;

const Profile = () => {
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const breedCode = useOnboardingStore((s) => s.breedCode);
  const color = useOnboardingStore((s) => s.color);
  const isNeutered = useOnboardingStore((s) => s.isNeutered);
  const weight = useOnboardingStore((s) => s.weight);
  const setField = useOnboardingStore((s) => s.setField);

  const updateColor = (hex: string) => setField("color", hex);

  useEffect(() => {
    if (!breedCode) return;
    const breed = BREED_DATA.find((b) => b.code === breedCode);
    if (breed) {
      setField("color", getBreedDefaultColor(breedCode));
    }
  }, [breedCode, setField]);

  const handleNext = () => {
    setHasSubmitted(true);
    const weightNum = Number(weight);

    if (
      !breedCode ||
      !color ||
      color === "#F2F2F2" ||
      !weight ||
      isNaN(weightNum) ||
      weightNum <= 0
    ) {
      return;
    }

    router.push("/(onboarding)/health");
  };

  return (
    <>
      <OnboardingScreen
        step={2}
        title={"궁금한게\n몇 가지 있어요"}
        subtitle="견종과 체중 정보를 입력하면 산책 기록이 더 정확해져요"
        ctaLabel="다음"
        onCtaPress={handleNext}
      >
        <View className="gap-4 rounded-3xl bg-white px-5 py-4">
          <FormControl isInvalid={hasSubmitted && !breedCode}>
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              견종
            </FormControlLabelText>
            <Select
              selectedValue={breedCode}
              onValueChange={(value) => setField("breedCode", value)}
            >
              <SelectTrigger
                variant="underlined"
                size="md"
                className="justify-between border-outline-200"
              >
                <SelectInput
                  placeholder="종을 선택하세요"
                  placeholderTextColor="#9CA3AF"
                  style={INPUT_TEXT_COLOR}
                />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="max-h-[60vh]">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <ScrollView className="w-full">
                    {BREED_DATA.map((breed) => (
                      <SelectItem
                        key={breed.code}
                        label={breed.name}
                        value={breed.code}
                      />
                    ))}
                  </ScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>견종을 선택해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            isInvalid={hasSubmitted && (!color || color === "#F2F2F2")}
          >
            <FormControlLabelText className="mb-2 text-sm font-semibold text-gray-500">
              대표 색상
            </FormControlLabelText>
            <Pressable onPress={() => setColorModalOpen(true)}>
              <View
                className="h-12 items-center justify-center rounded-2xl border border-outline-200 px-3"
                style={{ backgroundColor: color }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color:
                      color === "#F2F2F2" ||
                      color.toLowerCase() === "#fff" ||
                      color.toLowerCase() === "#ffffff"
                        ? "#0D0F1B"
                        : "#FFFFFF",
                  }}
                >
                  {color === "#F2F2F2" ? "색상 선택" : color}
                </Text>
              </View>
            </Pressable>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>색상을 선택해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl>
            <HStack className="items-center justify-between">
              <FormControlLabelText className="text-sm font-semibold text-gray-500">
                중성화 여부
              </FormControlLabelText>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#F25857" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
                onValueChange={(value) => setField("isNeutered", value)}
                value={isNeutered}
              />
            </HStack>
          </FormControl>

          <FormControl
            isInvalid={
              hasSubmitted &&
              (!weight || isNaN(Number(weight)) || Number(weight) <= 0)
            }
          >
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              체중 (kg)
            </FormControlLabelText>
            <Input
              size="md"
              variant="underlined"
              className="border-outline-200"
            >
              <InputField
                placeholder="예: 4.5"
                placeholderTextColor="#9CA3AF"
                value={weight}
                keyboardType="decimal-pad"
                style={INPUT_TEXT_COLOR}
                onChange={(e) => {
                  const text = e.nativeEvent.text.replace(/[^0-9.]/g, "");
                  setField("weight", text);
                }}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>체중을 입력해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>
      </OnboardingScreen>

      <Modal visible={colorModalOpen} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-white p-6 pb-10">
            <Text className="mb-6 text-center text-lg font-bold text-[#0D0F1B]">
              반려견 색상 선택
            </Text>

            <ColorPicker
              style={{ width: "100%", gap: 16 }}
              value={color}
              onComplete={(colors) => {
                "worklet";
                runOnJS(updateColor)(colors.hex);
              }}
            >
              <Panel1 />
              <HueSlider />
              <Swatches />
            </ColorPicker>

            <Pressable
              className="mt-6 items-center rounded-2xl bg-[#F25857] py-4"
              onPress={() => setColorModalOpen(false)}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-base font-semibold text-white">확인</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Profile;
