import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { AllergyFormValues, AllergySeverity } from "@/types/allergy";
import {
  ALLERGY_CATEGORIES,
  ALLERGY_CATEGORY_COLORS,
  ALLERGY_SEVERITIES,
  ALLERGY_SEVERITY_COLORS,
  getCategoryLabel,
  getSeverityLabel,
} from "@/util/allergy";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea, TextareaInput } from "../ui/textarea";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

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
  isEdit?: boolean;
  onSubmit: (values: AllergyFormValues) => void;
  onDelete: () => void;
}

const FormField = ({
  label,
  error,
  errorMessage,
  children,
}: {
  label: string;
  error?: boolean;
  errorMessage?: string;
  children: ReactNode;
}) => (
  <FormControl isInvalid={error}>
    <FormControlLabelText className="mb-2 text-sm font-semibold text-gray-500">
      {label}
    </FormControlLabelText>
    {children}
    {errorMessage ? (
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{errorMessage}</FormControlErrorText>
      </FormControlError>
    ) : null}
  </FormControl>
);

const AllergyForm = ({
  initialValues,
  submitLabel = "저장하기",
  isEdit = false,
  onSubmit,
  onDelete,
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
    <View className="w-full gap-5 pb-2">
      <FormField label="분류">
        <View className="flex-row flex-wrap gap-2">
          {ALLERGY_CATEGORIES.map((value) => {
            const selected = category === value;
            const theme = ALLERGY_CATEGORY_COLORS[value];
            return (
              <Pressable
                key={value}
                onPress={() => setCategory(value)}
                className="rounded-full px-3 py-1.5 active:opacity-80"
                style={{
                  backgroundColor: selected ? theme.bg : "#F7F7F7",
                  borderWidth: 1,
                  borderColor: selected ? theme.color : "transparent",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: selected ? theme.color : "#6B7280" }}
                >
                  {getCategoryLabel(value)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField
        label="알러지 유발 물질"
        error={hasSubmitted && !allergen.trim()}
        errorMessage="알러젠을 입력해주세요."
      >
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-1">
          <Input className="border-0 bg-transparent" size="md">
            <InputField
              placeholder="예: 닭고기, 꽃가루"
              placeholderTextColor="#9CA3AF"
              style={INPUT_TEXT_STYLE}
              value={allergen}
              onChangeText={setAllergen}
            />
          </Input>
        </View>
      </FormField>

      <FormField label="심각도 (선택)">
        <View className="flex-row flex-wrap gap-2">
          {ALLERGY_SEVERITIES.map((value) => {
            const selected = severity === value;
            const theme = ALLERGY_SEVERITY_COLORS[value];
            return (
              <Pressable
                key={value}
                onPress={() => setSeverity(selected ? undefined : value)}
                className="rounded-full px-3 py-1.5 active:opacity-80"
                style={{
                  backgroundColor: selected ? theme.bg : "#F7F7F7",
                  borderWidth: 1,
                  borderColor: selected ? theme.color : "transparent",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: selected ? theme.color : "#6B7280" }}
                >
                  {getSeverityLabel(value)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField label="증상 메모 (선택)">
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Textarea className="min-h-[88px] border-0 bg-transparent" size="md">
            <TextareaInput
              placeholder="가려움, 설사 등"
              placeholderTextColor="#9CA3AF"
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              textAlignVertical="top"
              className="min-h-[72px] text-base"
              style={INPUT_TEXT_STYLE}
            />
          </Textarea>
        </View>
      </FormField>

      <FormControl>
        <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <FormControlLabelText className="text-sm font-semibold text-[#0D0F1B]">
            현재 해당
          </FormControlLabelText>
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#F25857" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D5DB"
            value={isActive}
            onValueChange={setIsActive}
          />
        </View>
      </FormControl>

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

      {isEdit ? (
        <Pressable
          onPress={onDelete}
          className="items-center py-2 active:opacity-70"
        >
          <Text className="text-sm font-medium text-[#F25857]">기록 삭제</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default AllergyForm;
