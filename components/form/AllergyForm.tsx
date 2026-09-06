import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { AllergyFormValues, AllergySeverity } from "@/types/allergy";
import {
  ALLERGY_SEVERITIES,
  ALLERGY_SEVERITY_COLORS,
  getSeverityLabel,
} from "@/util/allergy";
import { ReactNode, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon, CalendarDaysIcon, Icon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea, TextareaInput } from "../ui/textarea";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

const defaultValues: AllergyFormValues = {
  allergen: "",
  severity: undefined,
  symptoms: "",
  diagnosedAt: null,
  isActive: true,
  memo: "",
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateLabel = (dateStr: string) =>
  dayjs(dateStr).locale("ko").format("YYYY년 M월 D일");

interface AllergyFormProps {
  initialValues?: Partial<AllergyFormValues>;
  submitLabel?: string;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: AllergyFormValues) => void | Promise<void>;
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
  isSubmitting = false,
  onSubmit,
  onDelete,
}: AllergyFormProps) => {
  const [allergen, setAllergen] = useState(
    initialValues?.allergen ?? defaultValues.allergen,
  );
  const [severity, setSeverity] = useState<AllergySeverity | undefined>(
    initialValues?.severity,
  );
  const [symptoms, setSymptoms] = useState(
    initialValues?.symptoms ?? defaultValues.symptoms,
  );
  const [diagnosedAt, setDiagnosedAt] = useState<string | null>(
    initialValues?.diagnosedAt ?? defaultValues.diagnosedAt ?? null,
  );
  const [memo, setMemo] = useState(initialValues?.memo ?? defaultValues.memo);
  const [isActive, setIsActive] = useState(
    initialValues?.isActive ?? defaultValues.isActive,
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const pickerDate = useMemo(
    () => (diagnosedAt ? new Date(diagnosedAt) : new Date()),
    [diagnosedAt],
  );

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (!allergen.trim() || isSubmitting) return;

    await onSubmit({
      allergen: allergen.trim(),
      severity,
      symptoms: symptoms?.trim() || undefined,
      diagnosedAt,
      isActive,
      memo: memo?.trim() || undefined,
    });
  };

  return (
    <View className="w-full gap-5 pb-2">
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
              editable={!isSubmitting}
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
                disabled={isSubmitting}
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

      <FormField label="증상 (선택)">
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Textarea className="min-h-[88px] border-0 bg-transparent" size="md">
            <TextareaInput
              placeholder="가려움, 설사 등"
              placeholderTextColor="#9CA3AF"
              value={symptoms}
              onChangeText={setSymptoms}
              editable={!isSubmitting}
              multiline
              textAlignVertical="top"
              className="min-h-[72px] text-base"
              style={INPUT_TEXT_STYLE}
            />
          </Textarea>
        </View>
      </FormField>

      <FormField label="확인일 (선택)">
        <Pressable
          onPress={() => setDatePickerOpen(true)}
          disabled={isSubmitting}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text className={diagnosedAt ? "text-[#0D0F1B]" : "text-gray-400"}>
            {diagnosedAt ? formatDateLabel(diagnosedAt) : "날짜를 선택하세요"}
          </Text>
          <Icon as={CalendarDaysIcon} size="sm" className="text-gray-400" />
        </Pressable>
      </FormField>

      <FormField label="메모 (선택)">
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Textarea className="min-h-[72px] border-0 bg-transparent" size="md">
            <TextareaInput
              placeholder="예: 간식 섭취 후 반응"
              placeholderTextColor="#9CA3AF"
              value={memo}
              onChangeText={setMemo}
              editable={!isSubmitting}
              multiline
              textAlignVertical="top"
              className="min-h-[56px] text-base"
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
            disabled={isSubmitting}
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

      {isEdit ? (
        <Pressable
          onPress={onDelete}
          disabled={isSubmitting}
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
        onConfirm={(date) => {
          setDiagnosedAt(formatDate(date));
          setDatePickerOpen(false);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
    </View>
  );
};

export default AllergyForm;
