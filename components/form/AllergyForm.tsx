import { AllergyFormValues, AllergySeverity } from "@/types/allergy";
import {
  ALLERGY_CATEGORIES,
  ALLERGY_SEVERITIES,
  getCategoryLabel,
  getSeverityLabel,
} from "@/util/allergyLabels";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, ButtonText } from "../ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "../ui/form-control";
import { HStack } from "../ui/hstack";
import { AlertCircleIcon, CircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "../ui/radio";
import { Switch } from "../ui/switch";
import { VStack } from "../ui/vstack";

const defaultValues: AllergyFormValues = {
  category: "food",
  allergen: "",
  severity: undefined,
  symptoms: "",
  diagnosedAt: null,
  isActive: true,
};

interface AllergyFormProps {
  initialValues?: Partial<AllergyFormValues>;
  submitLabel?: string;
  onSubmit: (values: AllergyFormValues) => void;
}

const AllergyForm = ({
  initialValues,
  submitLabel = "저장",
  onSubmit,
}: AllergyFormProps) => {
  const [category, setCategory] = useState(
    initialValues?.category ?? defaultValues.category,
  );
  const [allergen, setAllergen] = useState(
    initialValues?.allergen ?? defaultValues.allergen,
  );
  const [severity, setSeverity] = useState<AllergySeverity | undefined>(
    initialValues?.severity,
  );
  const [symptoms, setSymptoms] = useState(
    initialValues?.symptoms ?? defaultValues.symptoms,
  );
  const [isActive, setIsActive] = useState(
    initialValues?.isActive ?? defaultValues.isActive,
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!allergen.trim()) return;

    onSubmit({
      category,
      allergen: allergen.trim(),
      severity,
      symptoms: symptoms?.trim() || undefined,
      diagnosedAt: initialValues?.diagnosedAt ?? null,
      isActive,
    });
  };

  return (
    <VStack className="w-full gap-4 pb-4">
      <FormControl>
        <FormControlLabelText className="text-[#0D0F1B]">
          분류
        </FormControlLabelText>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {ALLERGY_CATEGORIES.map((value) => {
            const selected = category === value;
            return (
              <Pressable
                key={value}
                onPress={() => setCategory(value)}
                className={`rounded-full border px-3 py-1.5 ${
                  selected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected
                      ? "font-semibold text-primary-600"
                      : "text-gray-700"
                  }`}
                >
                  {getCategoryLabel(value)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !allergen.trim()}>
        <FormControlLabelText className="text-[#0D0F1B]">
          알러지 유발 물질
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            placeholder="예: 닭고기, 꽃가루"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
            value={allergen}
            onChangeText={setAllergen}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>알러젠을 입력해주세요.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl>
        <FormControlLabelText className="text-[#0D0F1B]">
          심각도 (선택)
        </FormControlLabelText>
        <RadioGroup
          value={severity ?? ""}
          onChange={(value) =>
            setSeverity(value ? (value as AllergySeverity) : undefined)
          }
        >
          <HStack space="md" className="my-2 flex-wrap">
            {ALLERGY_SEVERITIES.map((value) => (
              <Radio key={value} value={value} size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel className="text-[#0D0F1B]">
                  {getSeverityLabel(value)}
                </RadioLabel>
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormControlLabelText className="text-[#0D0F1B]">
          증상 메모 (선택)
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            placeholder="가려움, 설사 등"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
          />
        </Input>
      </FormControl>

      <FormControl>
        <HStack className="items-center justify-between">
          <FormControlLabelText className="text-[#0D0F1B]">
            현재 해당
          </FormControlLabelText>
          <Switch
            trackColor={{ false: "#d4d4d4", true: "#525252" }}
            thumbColor="#fafafa"
            ios_backgroundColor="#d4d4d4"
            value={isActive}
            onValueChange={setIsActive}
          />
        </HStack>
      </FormControl>

      <Button
        onPress={handleSubmit}
        className="mt-2 w-full rounded-2xl bg-primary-500"
      >
        <ButtonText>{submitLabel}</ButtonText>
      </Button>
    </VStack>
  );
};

export default AllergyForm;
