import RedButtonSurface from "@/components/ui/RedButtonSurface";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
  Icon,
} from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
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
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  isMedicationDoseUnit,
  MEDICATION_DOSE_UNIT_LABELS,
  MEDICATION_DOSE_UNITS,
  type MedicationDoseUnit,
} from "@/constants/medicationDoseUnits";
import { MedicationFormValues } from "@/types/medication";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ReactNode, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import DatePicker from "react-native-date-picker";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

interface MedicationFormProps {
  initialValues?: Partial<MedicationFormValues>;
  submitLabel?: string;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: MedicationFormValues) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatTime = (date: Date) => {
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
};

const formatDateLabel = (dateStr: string) =>
  dayjs(dateStr).locale("ko").format("YYYY년 M월 D일");

const parseTimeToDate = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const resolveInitialDoseUnit = (
  unit?: MedicationDoseUnit | string,
): MedicationDoseUnit => {
  if (unit && isMedicationDoseUnit(unit)) return unit;
  return "tablet";
};

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

const MedicationForm = ({
  initialValues,
  submitLabel = "저장하기",
  isEdit = false,
  isSubmitting = false,
  onSubmit,
  onDelete,
}: MedicationFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [doseAmount, setDoseAmount] = useState(
    initialValues?.doseAmount != null ? String(initialValues.doseAmount) : "",
  );
  const [doseUnit, setDoseUnit] = useState<MedicationDoseUnit>(
    resolveInitialDoseUnit(initialValues?.doseUnit),
  );
  const [date, setDate] = useState(
    initialValues?.date ?? formatDate(new Date()),
  );
  const [time, setTime] = useState(initialValues?.time ?? "09:00");
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const pickerDate = useMemo(
    () => (date ? new Date(date) : new Date()),
    [date],
  );
  const pickerTime = useMemo(() => parseTimeToDate(time), [time]);

  const doseAmountNum = Number(doseAmount);
  const isNameValid = name.trim().length > 0;
  const isDoseAmountValid =
    doseAmount.trim() !== "" &&
    !Number.isNaN(doseAmountNum) &&
    doseAmountNum > 0;

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (!isNameValid || !isDoseAmountValid || !date || !time || !doseUnit) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      doseAmount: doseAmountNum,
      doseUnit,
      date,
      time,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <View className="w-full gap-5 pb-2">
      <FormField
        label="약 이름"
        error={hasSubmitted && !isNameValid}
        errorMessage="약 이름을 입력해주세요."
      >
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-1">
          <Input className="border-0 bg-transparent" size="md">
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="예: 심장사상충 예방약"
              placeholderTextColor="#9CA3AF"
              style={INPUT_TEXT_STYLE}
              editable={!isSubmitting}
            />
          </Input>
        </View>
      </FormField>

      <FormField
        label="투약량"
        error={hasSubmitted && !isDoseAmountValid}
        errorMessage="0보다 큰 투약량을 입력해주세요."
      >
        <View className="flex-row gap-2">
          <View className="flex-1 rounded-2xl bg-[#F7F7F7] px-4 py-1">
            <Input className="border-0 bg-transparent" size="md">
              <InputField
                value={doseAmount}
                onChangeText={setDoseAmount}
                placeholder="예: 1"
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
                style={INPUT_TEXT_STYLE}
                editable={!isSubmitting}
              />
            </Input>
          </View>

          <View className="w-[132px]">
            <Select
              selectedValue={doseUnit}
              onValueChange={(value) => {
                if (isMedicationDoseUnit(value)) {
                  setDoseUnit(value);
                }
              }}
              isDisabled={isSubmitting}
            >
              <SelectTrigger
                variant="outline"
                size="md"
                className="h-[52px] justify-between rounded-2xl border-0 bg-[#F7F7F7]"
              >
                <SelectInput
                  value={MEDICATION_DOSE_UNIT_LABELS[doseUnit]}
                  placeholder="단위"
                  placeholderTextColor="#9CA3AF"
                  style={INPUT_TEXT_STYLE}
                />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="max-h-[50vh]">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <ScrollView className="w-full">
                    {MEDICATION_DOSE_UNITS.map((unit) => (
                      <SelectItem
                        key={unit}
                        label={MEDICATION_DOSE_UNIT_LABELS[unit]}
                        value={unit}
                      />
                    ))}
                  </ScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>
        </View>
      </FormField>

      <FormField
        label="날짜"
        error={hasSubmitted && !date}
        errorMessage="날짜를 선택해주세요."
      >
        <Pressable
          onPress={() => !isSubmitting && setDatePickerOpen(true)}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text className={date ? "text-[#0D0F1B]" : "text-gray-400"}>
            {date ? formatDateLabel(date) : "날짜를 선택하세요"}
          </Text>
          <Icon as={CalendarDaysIcon} size="sm" className="text-gray-400" />
        </Pressable>
      </FormField>

      <FormField
        label="투약 시간"
        error={hasSubmitted && !time}
        errorMessage="시간을 선택해주세요."
      >
        <Pressable
          onPress={() => !isSubmitting && setTimePickerOpen(true)}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text className={time ? "text-[#0D0F1B]" : "text-gray-400"}>
            {time || "시간을 선택하세요"}
          </Text>
          <Icon as={ClockIcon} size="sm" className="text-gray-400" />
        </Pressable>
      </FormField>

      <FormField label="메모 (선택)">
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Textarea className="min-h-[88px] border-0 bg-transparent" size="md">
            <TextareaInput
              value={memo}
              onChangeText={setMemo}
              placeholder="예: 식후 투여"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              className="min-h-[72px] text-base"
              style={INPUT_TEXT_STYLE}
              editable={!isSubmitting}
            />
          </Textarea>
        </View>
      </FormField>

      <RedButtonSurface
        borderRadius={30}
        backgroundColor="#F25857"
        shadowPadding={8}
        hostStyle={{ width: "100%" }}
        style={{ width: "100%", height: 56, opacity: isSubmitting ? 0.6 : 1 }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
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
          onPress={() => void onDelete()}
          disabled={isSubmitting}
          className="items-center py-2 active:opacity-70"
        >
          <Text className="text-sm font-medium text-[#F25857]">일정 삭제</Text>
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

      <DatePicker
        modal
        open={timePickerOpen}
        mode="time"
        locale="ko"
        date={pickerTime}
        title="투약 시간"
        confirmText="확인"
        cancelText="취소"
        onConfirm={(picked) => {
          setTime(formatTime(picked));
          setTimePickerOpen(false);
        }}
        onCancel={() => setTimePickerOpen(false)}
      />
    </View>
  );
};

export default MedicationForm;
