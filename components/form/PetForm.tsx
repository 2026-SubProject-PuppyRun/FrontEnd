import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { BREED_DATA } from "@/constants/breedData";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { Pet } from "@/store/usePetStore";
import { getBreedDefaultColor, getBreedName } from "@/util/pet";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ReactNode, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { runOnJS } from "react-native-reanimated";
import ColorPicker, {
  HueSlider,
  Panel1,
  Swatches,
} from "reanimated-color-picker";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../ui/checkbox";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "../ui/form-control";
import { HStack } from "../ui/hstack";
import {
  AlertCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
} from "../ui/icon";
import { Input, InputField } from "../ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "../ui/radio";
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
} from "../ui/select";
import { Switch } from "../ui/switch";

const INPUT_TEXT_COLOR = { color: "#0D0F1B" } as const;

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View className="mb-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
    <Text className="mb-3 text-sm font-semibold text-gray-500">{title}</Text>
    <View className="gap-4">{children}</View>
  </View>
);

interface PetFormProps {
  initialData?: Pet;
  onSubmit: (data: Partial<Pet>) => void;
}

const PetForm = ({ initialData, onSubmit }: PetFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [birthYear, setBirthYear] = useState<string | null>(
    initialData?.birthYear ?? "",
  );
  const [weight, setWeight] = useState<string>(
    initialData?.weight?.toString() || "",
  );
  const [color, setColor] = useState(initialData?.color || "#F2F2F2");
  const [breedCode, setBreedCode] = useState(
    getBreedName(initialData?.breedCode) || "",
  );
  const [profileImageUrl, setProfileImageUrl] = useState(
    initialData?.profileImageUrl || "",
  );
  const [isNeutered, setIsNeutered] = useState(
    initialData?.isNeutered || false,
  );
  const [gender, setGender] = useState<"F" | "M" | undefined>(
    initialData?.gender || undefined,
  );

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const router = useRouter();
  const { showToast } = useCustomToast();
  const submitLabel = initialData ? "저장하기" : "등록하기";

  const handleClose = () => setShowActionsheet(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUrl(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("카메라 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const weightNum = Number(weight);
    if (
      !name.trim() ||
      !gender ||
      birthYear === "" ||
      !weight ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !breedCode ||
      !color ||
      isNeutered === undefined
    ) {
      return;
    }

    if (!profileImageUrl) {
      showToast({
        message: "반려견 사진을 등록해주세요.",
        icon: AlertCircleIcon,
      });
      return;
    }

    onSubmit({
      ...initialData,
      name,
      birthYear,
      weight: weightNum,
      color,
      breedCode,
      profileImageUrl,
      isNeutered,
      gender,
    });
    router.replace("/mypage/pets");
  };

  const birthLabel =
    birthYear === null
      ? ""
      : birthYear
        ? new Date(birthYear).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "날짜를 선택하세요";

  useMemo(() => {
    if (breedCode) {
      const breed = BREED_DATA.find((b) => b.code === breedCode);
      if (breed) {
        setColor(getBreedDefaultColor(breedCode));
      }
    }
  }, [breedCode]);

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4 items-center rounded-3xl bg-white px-5 py-6 shadow-sm">
          <Text className="mb-4 text-sm font-semibold text-gray-500">
            프로필 사진
          </Text>
          <Pressable onPress={() => setShowActionsheet(true)}>
            <View
              className="h-28 w-28 overflow-hidden rounded-full border-4 bg-[#F1F5F9]"
              style={{
                borderColor:
                  color !== "#F2F2F2" ? color : "rgba(242, 88, 87, 0.35)",
              }}
            >
              {profileImageUrl ? (
                <Image
                  source={{ uri: profileImageUrl }}
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

        <FormSection title="기본 정보">
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
                onChange={(e) => setName(e.nativeEvent.text)}
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
              onChange={(value) => setGender(value as "F" | "M")}
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

          <FormControl isInvalid={hasSubmitted && birthYear === ""}>
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              생년월일
            </FormControlLabelText>
            <HStack className="items-center gap-3">
              <Pressable
                className="flex-1"
                onPress={() => setDateModalOpen(true)}
                disabled={birthYear === null}
              >
                <View className="border-b border-outline-200 pb-2 pt-2">
                  <Text
                    style={{
                      color:
                        birthYear === null || !birthYear
                          ? "#9CA3AF"
                          : "#0D0F1B",
                    }}
                    className="text-base"
                  >
                    {birthYear === null ? "모름" : birthLabel}
                  </Text>
                </View>
              </Pressable>

              <DatePicker
                modal
                open={dateModalOpen}
                date={birthYear ? new Date(birthYear) : new Date()}
                mode="date"
                locale="ko"
                title="생년월일 선택"
                confirmText="확인"
                cancelText="취소"
                onConfirm={(date) => {
                  setDateModalOpen(false);
                  setBirthYear(date.toISOString().split("T")[0]);
                }}
                onCancel={() => {
                  setDateModalOpen(false);
                }}
              />

              <Checkbox
                size="md"
                value="unknown"
                isChecked={birthYear === null}
                onChange={(isChecked) => {
                  if (isChecked) {
                    setBirthYear(null);
                  } else {
                    setBirthYear("");
                  }
                }}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="text-[#0D0F1B]">모름</CheckboxLabel>
              </Checkbox>
            </HStack>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                생년월일을 선택하거나 모름을 체크해주세요.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={hasSubmitted && !weight}>
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
                  setWeight(text);
                }}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>체중을 입력해주세요.</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </FormSection>

        <FormSection title="상세 정보">
          <FormControl isInvalid={hasSubmitted && !breedCode}>
            <FormControlLabelText className="mb-1 text-sm font-semibold text-gray-500">
              견종
            </FormControlLabelText>
            <Select selectedValue={breedCode} onValueChange={setBreedCode}>
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

          <FormControl isInvalid={hasSubmitted && !color}>
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

          <FormControl isInvalid={hasSubmitted && isNeutered === undefined}>
            <HStack className="items-center justify-between">
              <FormControlLabelText className="text-sm font-semibold text-gray-500">
                중성화 여부
              </FormControlLabelText>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#F25857" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
                onValueChange={setIsNeutered}
                value={isNeutered}
              />
            </HStack>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                중성화 여부를 선택해주세요.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </FormSection>

        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 56 }}
        >
          <Pressable
            onPress={handleSubmit}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-base font-semibold text-white">
              {submitLabel}
            </Text>
          </Pressable>
        </RedButtonSurface>
      </ScrollView>

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
                runOnJS(setColor)(colors.hex);
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

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              handleClose();
              pickImage();
            }}
          >
            <ActionsheetItemText>앨범에서 가져오기</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              handleClose();
              takePhoto();
            }}
          >
            <ActionsheetItemText>촬영하기</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default PetForm;
