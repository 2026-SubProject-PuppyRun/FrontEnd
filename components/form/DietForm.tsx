import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
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
import { DietFormValues, DietMealType } from "@/types/diet";
import { useMemo, useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";

interface DietFormProps {
  initialValues?: Partial<DietFormValues>;
  defaultType?: DietMealType;
  submitLabel?: string;
  onSubmit: (values: DietFormValues) => void;
  onDelete: () => void;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const DietForm = ({
  initialValues,
  defaultType = "food",
  submitLabel = "저장",
  onSubmit,
  onDelete,
}: DietFormProps) => {
  const [type, setType] = useState<DietMealType>(
    initialValues?.type ?? defaultType,
  );
  const [amount, setAmount] = useState(
    initialValues?.amount != null ? String(initialValues.amount) : "",
  );
  const [date, setDate] = useState(initialValues?.date ?? formatDate(new Date()));
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const pickerDate = useMemo(
    () => (date ? new Date(date) : new Date()),
    [date],
  );

  const amountNum = Number(amount);
  const isAmountValid =
    amount.trim() !== "" && !Number.isNaN(amountNum) && amountNum > 0;

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!isAmountValid || !date) return;

    onSubmit({
      type,
      amount: amountNum,
      date,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <View className="w-full gap-4 pb-4">
      <FormControl>
        <FormControlLabelText className="text-[#0D0F1B]">종류</FormControlLabelText>
        <HStack className="mt-2 gap-2">
          {(["food", "snack"] as DietMealType[]).map((mealType) => {
            const theme = DIET_MEAL_COLORS[mealType];
            const selected = type === mealType;
            return (
              <Pressable
                key={mealType}
                onPress={() => setType(mealType)}
                className="flex-1 rounded-2xl border px-3 py-3"
                style={{
                  borderColor: selected ? theme.color : "#E5E7EB",
                  backgroundColor: selected ? theme.bg : "#FFFFFF",
                }}
              >
                <Text
                  className="text-center text-base font-medium"
                  style={{ color: selected ? theme.color : "#6B7280" }}
                >
                  {theme.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !isAmountValid}>
        <FormControlLabelText className="text-[#0D0F1B]">
          양(g)
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            value={amount}
            onChangeText={setAmount}
            placeholder="예: 120"
            keyboardType="number-pad"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>양을 입력해주세요.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !date}>
        <FormControlLabelText className="text-[#0D0F1B]">날짜</FormControlLabelText>
        <Pressable
          onPress={() => setDatePickerOpen(true)}
          className="mt-1 rounded-xl border border-gray-300 px-3 py-3"
        >
          <Text className={date ? "text-[#0D0F1B]" : "text-gray-400"}>
            {date || "날짜를 선택하세요"}
          </Text>
        </Pressable>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>날짜를 선택해주세요.</FormControlErrorText>
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
            placeholder="예: 저녁 조금 줄임"
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
        onConfirm={(picked) => {
          setDate(formatDate(picked));
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

export default DietForm;
