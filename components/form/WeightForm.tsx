import RedButtonSurface from "@/components/ui/RedButtonSurface";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { WeightFormValues } from "@/types/weight";
import { ReactNode, useState } from "react";
import { View } from "react-native";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

interface WeightFormProps {
  initialValues?: Partial<WeightFormValues>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (values: WeightFormValues) => void | Promise<void>;
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

const WeightForm = ({
  initialValues,
  submitLabel = "저장하기",
  isSubmitting = false,
  onSubmit,
}: WeightFormProps) => {
  const [weight, setWeight] = useState(
    initialValues?.weight != null ? String(initialValues.weight) : "",
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const weightNum = Number(weight);
  const isWeightValid =
    weight.trim() !== "" && !Number.isNaN(weightNum) && weightNum >= 1;

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (!isWeightValid || isSubmitting) return;

    await onSubmit({ weight: weightNum });
  };

  return (
    <View className="w-full gap-5 pb-2">
      <FormField
        label="체중"
        error={hasSubmitted && !isWeightValid}
        errorMessage="1kg 이상의 체중을 입력해주세요."
      >
        <View className="flex-row items-center rounded-2xl bg-[#F7F7F7] px-4 py-1">
          <Input className="flex-1 border-0 bg-transparent" size="md">
            <InputField
              value={weight}
              onChangeText={setWeight}
              placeholder="예: 4.5"
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
              style={INPUT_TEXT_STYLE}
              editable={!isSubmitting}
            />
          </Input>
          <Text className="ml-2 text-sm font-medium text-gray-400">kg</Text>
        </View>
      </FormField>

      <RedButtonSurface
        borderRadius={30}
        backgroundColor="#F25857"
        shadowPadding={8}
        hostStyle={{ width: "100%" }}
        style={{ width: "100%", height: 56 }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="h-full w-full items-center justify-center"
          style={({ pressed }) =>
            pressed || isSubmitting ? { opacity: 0.85 } : undefined
          }
        >
          <Text className="text-base font-semibold text-white">
            {submitLabel}
          </Text>
        </Pressable>
      </RedButtonSurface>
    </View>
  );
};

export default WeightForm;
