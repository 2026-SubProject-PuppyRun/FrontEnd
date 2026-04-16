import { Pet } from "@/store/usePetStore";
import { BREED_LIST, getBreedDefaultColor } from "@/util/getBreedCode";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
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
import { FormControl, FormControlLabelText } from "../ui/form-control";
import { HStack } from "../ui/hstack";
import { CheckIcon, ChevronDownIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
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
  const [color, setColor] = useState(initialData?.color || "#FFFFFF");
  const [breedCode, setBreedCode] = useState(initialData?.breedCode || "");
  const [profileImageUrl, setProfileImageUrl] = useState(
    initialData?.profileImageUrl || "",
  );
  const [isNeutered, setIsNeutered] = useState(
    initialData?.isNeutered || false,
  );
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const handleClose = () => setShowActionsheet(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
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

    let result = await ImagePicker.launchCameraAsync({
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
    onSubmit({
      ...initialData,
      name,
      birthYear,
      weight: Number(weight) || 0,
      color,
      breedCode,
      profileImageUrl,
      isNeutered,
    });
  };

  useMemo(() => {
    if (breedCode) {
      const breed = BREED_LIST.find((b) => b.value === breedCode);
      if (breed) {
        setColor(getBreedDefaultColor(breedCode));
      }
    }
  }, [breedCode]);
  return (
    <View className="m-4 flex-1 rounded-lg bg-gray-200 p-4">
      <View className="mb-6 items-center">
        <Pressable onPress={() => setShowActionsheet(true)}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              className="h-32 w-32 rounded-full"
            />
          ) : (
            <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-s text-gray-500">사진 추가</Text>
            </View>
          )}
        </Pressable>
      </View>

      <FormControl className="gap-2">
        <FormControlLabelText className="text-black">이름</FormControlLabelText>
        <Input size="md" variant="underlined">
          <InputField
            className="text-black"
            value={name}
            onChange={(e) => setName(e.nativeEvent.text)}
          />
        </Input>
        <FormControlLabelText className="text-black">
          생년월일
        </FormControlLabelText>
        <HStack className="items-center gap-4">
          <Pressable
            className="flex-1"
            onPress={() => setDateModalOpen(true)}
            disabled={birthYear === null}
          >
            <View
              className={`border-b pb-2 pt-3 ${
                birthYear === null ? "border-gray-400" : "border-gray-500"
              }`}
            >
              <Text
                className={`text-base ${
                  birthYear === null ? "text-gray-400" : "text-black"
                }`}
              >
                {birthYear === null ? "" : birthYear || "날짜를 선택하세요"}
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
            <CheckboxLabel className="text-black ">모름</CheckboxLabel>
          </Checkbox>
        </HStack>

        <FormControlLabelText className="text-black">
          체중(kg)
        </FormControlLabelText>
        <Input size="md" variant="underlined">
          <InputField
            className="text-black"
            value={weight}
            keyboardType="decimal-pad"
            onChange={(e) => {
              const text = e.nativeEvent.text.replace(/[^0-9.]/g, "");
              setWeight(text);
            }}
          />
        </Input>
        <FormControlLabelText className="text-black">견종</FormControlLabelText>
        <Select selectedValue={breedCode} onValueChange={setBreedCode}>
          <SelectTrigger
            variant="underlined"
            size="md"
            className=" justify-between"
          >
            <SelectInput placeholder="종을 선택하세요" className="text-black" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>

          <SelectPortal>
            <SelectBackdrop />
            <SelectContent className="max-h-[60vh]">
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>

              <ScrollView className="w-full">
                {BREED_LIST.map((breed) => (
                  <SelectItem
                    key={breed.value}
                    label={breed.label}
                    value={breed.value}
                  />
                ))}
              </ScrollView>
            </SelectContent>
          </SelectPortal>
        </Select>
        <HStack className=" items-center" space="lg">
          <FormControlLabelText className="text-black">
            색상
          </FormControlLabelText>
          <Pressable onPress={() => setColorModalOpen(true)}>
            <View
              className="h-12 w-full items-center justify-center rounded-2xl border border-gray-400 px-2"
              style={{ backgroundColor: color }}
            >
              <Text
                className={
                  color === "#FFFFFF" || color.toLowerCase() === "#fff"
                    ? "text-black"
                    : "text-white drop-shadow-md"
                }
              >
                {color === "#FFFFFF" ? "색상 선택" : color}
              </Text>
            </View>
          </Pressable>
        </HStack>

        <HStack className=" items-center" space="lg">
          <FormControlLabelText className="text-black">
            중성화 여부
          </FormControlLabelText>
          <Switch
            trackColor={{ false: "#d4d4d4", true: "#525252" }}
            thumbColor="#fafafa"
            ios_backgroundColor="#d4d4d4"
            onValueChange={setIsNeutered}
            value={isNeutered}
          />
        </HStack>

        <Modal
          visible={colorModalOpen}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="rounded-t-3xl bg-white p-6 pb-10">
              <Text className="mb-6 text-center text-lg font-bold text-black">
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
                className="mt-6 items-center rounded-lg bg-blue-500 py-4"
                onPress={() => setColorModalOpen(false)}
              >
                <Text className="text-lg font-bold text-white">확인</Text>
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
      </FormControl>
    </View>
  );
};

export default PetForm;
