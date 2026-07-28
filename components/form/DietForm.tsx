import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { DIET_MEAL_COLORS } from "@/constants/dietTheme";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, CalendarDaysIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { DietFormValues, DietMealType } from "@/types/diet";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ReactNode, useMemo, useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

interface DietFormProps {
  initialValues?: Partial<DietFormValues>;
  defaultType?: DietMealType;
  submitLabel?: string;
  isEdit?: boolean;
  onSubmit: (values: DietFormValues) => void;
  onDelete: () => void;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateLabel = (dateStr: string) =>
  dayjs(dateStr).locale("ko").format("YYYY년 M월 D일");

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

const DietForm = ({
  initialValues,
  defaultType = "food",
  submitLabel = "저장하기",
  isEdit = false,
  onSubmit,
  onDelete,
}: DietFormProps) => {
  const [type, setType] = useState<DietMealType>(
    initialValues?.type ?? defaultType,
  );
  const [amount, setAmount] = useState(
    initialValues?.amount != null ? String(initialValues.amount) : "",
  );
  const [date, setDate] = useState(
    initialValues?.date ?? formatDate(new Date()),
  );
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
    <View className="w-full gap-5 pb-2">
      <FormField label="종류">
        <HStack className="gap-2">
          {(["food", "snack"] as DietMealType[]).map((mealType) => {
            const theme = DIET_MEAL_COLORS[mealType];
            const selected = type === mealType;
            return (
              <Pressable
                key={mealType}
                onPress={() => setType(mealType)}
                className="min-h-[52px] flex-1 items-center justify-center rounded-2xl active:opacity-80"
                style={{
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? theme.color : "#E5E7EB",
                  backgroundColor: selected ? theme.bg : "#FFFFFF",
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: selected ? theme.color : "#6B7280" }}
                >
                  {theme.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </FormField>

      <FormField
        label="양"
        error={hasSubmitted && !isAmountValid}
        errorMessage="양을 입력해주세요."
      >
        <View className="flex-row items-center rounded-2xl bg-[#F7F7F7] px-4 py-1">
          <Input className="flex-1 border-0 bg-transparent" size="md">
            <InputField
              value={amount}
              onChangeText={setAmount}
              placeholder="예: 120"
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
              style={INPUT_TEXT_STYLE}
            />
          </Input>
          <Text className="ml-2 text-sm font-medium text-gray-400">g</Text>
        </View>
      </FormField>

      <FormField
        label="날짜"
        error={hasSubmitted && !date}
        errorMessage="날짜를 선택해주세요."
      >
        <Pressable
          onPress={() => setDatePickerOpen(true)}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text className={date ? "text-[#0D0F1B]" : "text-gray-400"}>
            {date ? formatDateLabel(date) : "날짜를 선택하세요"}
          </Text>
          <Icon as={CalendarDaysIcon} size="sm" className="text-gray-400" />
        </Pressable>
      </FormField>

      <FormField label="메모 (선택)">
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Textarea className="min-h-[88px] border-0 bg-transparent" size="md">
            <TextareaInput
              value={memo}
              onChangeText={setMemo}
              placeholder="예: 저녁 조금 줄임"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              className="min-h-[72px] text-base"
              style={INPUT_TEXT_STYLE}
            />
          </Textarea>
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
    </View>
  );
};

export default DietForm;
