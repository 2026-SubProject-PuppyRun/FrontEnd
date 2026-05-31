import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { WeightFormValues } from "@/types/weight";
import { useMemo, useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";

interface WeightFormProps {
  initialValues?: Partial<WeightFormValues>;
  submitLabel?: string;
  onSubmit: (values: WeightFormValues) => void;
  onDelete: () => void;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const WeightForm = ({
  initialValues,
  submitLabel = "저장",
  onSubmit,
  onDelete,
}: WeightFormProps) => {
  const [weight, setWeight] = useState(
    initialValues?.weight != null ? String(initialValues.weight) : "",
  );
  const [measuredAt, setMeasuredAt] = useState(
    initialValues?.measuredAt ?? "",
  );
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const pickerDate = useMemo(
    () => (measuredAt ? new Date(measuredAt) : new Date()),
    [measuredAt],
  );

  const weightNum = Number(weight);
  const isWeightValid = weight.trim() !== "" && !Number.isNaN(weightNum) && weightNum > 0;

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!isWeightValid || !measuredAt) return;

    onSubmit({
      weight: weightNum,
      measuredAt,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <View className="w-full gap-4 pb-4">
      <FormControl isInvalid={hasSubmitted && !isWeightValid}>
        <FormControlLabelText className="text-[#0D0F1B]">
          체중(kg)
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            value={weight}
            onChangeText={setWeight}
            placeholder="예: 4.5"
            keyboardType="decimal-pad"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>체중을 입력해주세요.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !measuredAt}>
        <FormControlLabelText className="text-[#0D0F1B]">
          측정 날짜
        </FormControlLabelText>
        <Pressable
          onPress={() => setDatePickerOpen(true)}
          className="mt-1 rounded-xl border border-gray-300 px-3 py-3"
        >
          <Text className={measuredAt ? "text-[#0D0F1B]" : "text-gray-400"}>
            {measuredAt || "날짜를 선택하세요"}
          </Text>
        </Pressable>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>측정 날짜를 선택해주세요.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl>
        <FormControlLabelText className="text-[#0D0F1B]">
          메모 (선택)
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            value={memo}
            onChangeText={setMemo}
            placeholder="예: 간식 줄이기 시작"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
          />
        </Input>
      </FormControl>

      <HStack className="mt-2 items-center gap-2">
        <Button
          onPress={handleSubmit}
          className="flex-1 rounded-2xl bg-primary-500"
        >
          <ButtonText>{submitLabel}</ButtonText>
        </Button>
      </HStack>

      <DatePicker
        modal
        open={datePickerOpen}
        mode="date"
        locale="ko"
        date={pickerDate}
        title="날짜 선택"
        confirmText="확인"
        cancelText="취소"
        onConfirm={(date) => {
          setMeasuredAt(formatDate(date));
          setDatePickerOpen(false);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />

      {submitLabel === "수정" ? (
        <Button onPress={onDelete} className="mt-2 rounded-2xl bg-error-500">
          <ButtonText>삭제</ButtonText>
        </Button>
      ) : null}
    </View>
  );
};

export default WeightForm;
