import RedButtonSurface from "@/components/ui/RedButtonSurface";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, CalendarDaysIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VaccineFormValues } from "@/types/vaccine";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ReactNode, useMemo, useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";

const INPUT_TEXT_STYLE = { color: "#0D0F1B" } as const;

const COMMON_VACCINES = ["종합백신", "광견병", "켄넬코프", "인플루엔자"];

interface VaccineFormProps {
  initialValues?: Partial<VaccineFormValues>;
  submitLabel?: string;
  isEdit?: boolean;
  onSubmit: (values: VaccineFormValues) => void;
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

const VaccineForm = ({
  initialValues,
  submitLabel = "저장하기",
  isEdit = false,
  onSubmit,
  onDelete,
}: VaccineFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [vaccinatedAt, setVaccinatedAt] = useState(
    initialValues?.vaccinatedAt ?? "",
  );
  const [nextVaccinationAt, setNextVaccinationAt] = useState(
    initialValues?.nextVaccinationAt ?? "",
  );
  const [pickField, setPickField] = useState<
    "vaccinatedAt" | "nextVaccinationAt" | null
  >(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const pickerDate = useMemo(() => {
    if (pickField === "vaccinatedAt" && vaccinatedAt)
      return new Date(vaccinatedAt);
    if (pickField === "nextVaccinationAt" && nextVaccinationAt) {
      return new Date(nextVaccinationAt);
    }
    return new Date();
  }, [pickField, vaccinatedAt, nextVaccinationAt]);

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!name.trim() || !vaccinatedAt || !nextVaccinationAt) return;

    onSubmit({
      name: name.trim(),
      vaccinatedAt,
      nextVaccinationAt,
    });
  };

  return (
    <View className="w-full gap-5 pb-2">
      <FormField
        label="예방접종 이름"
        error={hasSubmitted && !name.trim()}
        errorMessage="예방접종 이름을 입력해주세요."
      >
        <View className="rounded-2xl bg-[#F7F7F7] px-4 py-1">
          <Input className="border-0 bg-transparent" size="md">
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="예: 종합백신"
              placeholderTextColor="#9CA3AF"
              style={INPUT_TEXT_STYLE}
            />
          </Input>
        </View>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {COMMON_VACCINES.map((vaccine) => {
            const selected = name === vaccine;
            return (
              <Pressable
                key={vaccine}
                onPress={() => setName(vaccine)}
                className="rounded-full px-3 py-1.5 active:opacity-80"
                style={{
                  backgroundColor: selected ? "#FEE2E2" : "#F7F7F7",
                  borderWidth: 1,
                  borderColor: selected ? "#F25857" : "transparent",
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: selected ? "#F25857" : "#6B7280" }}
                >
                  {vaccine}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField
        label="접종 날짜"
        error={hasSubmitted && !vaccinatedAt}
        errorMessage="접종 날짜를 선택해주세요."
      >
        <Pressable
          onPress={() => setPickField("vaccinatedAt")}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text className={vaccinatedAt ? "text-[#0D0F1B]" : "text-gray-400"}>
            {vaccinatedAt ? formatDateLabel(vaccinatedAt) : "날짜를 선택하세요"}
          </Text>
          <Icon as={CalendarDaysIcon} size="sm" className="text-gray-400" />
        </Pressable>
      </FormField>

      <FormField
        label="다음 접종일"
        error={hasSubmitted && !nextVaccinationAt}
        errorMessage="다음 접종일을 선택해주세요."
      >
        <Pressable
          onPress={() => setPickField("nextVaccinationAt")}
          className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5 active:opacity-80"
        >
          <Text
            className={nextVaccinationAt ? "text-[#0D0F1B]" : "text-gray-400"}
          >
            {nextVaccinationAt
              ? formatDateLabel(nextVaccinationAt)
              : "날짜를 선택하세요"}
          </Text>
          <Icon as={CalendarDaysIcon} size="sm" className="text-gray-400" />
        </Pressable>
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
        open={pickField !== null}
        mode="date"
        locale="ko"
        date={pickerDate}
        title="날짜 선택"
        confirmText="확인"
        cancelText="취소"
        onConfirm={(date) => {
          const formatted = formatDate(date);
          if (pickField === "vaccinatedAt") {
            setVaccinatedAt(formatted);
          } else if (pickField === "nextVaccinationAt") {
            setNextVaccinationAt(formatted);
          }
          setPickField(null);
        }}
        onCancel={() => setPickField(null)}
      />
    </View>
  );
};

export default VaccineForm;
