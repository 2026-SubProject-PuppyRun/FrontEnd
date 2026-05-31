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
import { VaccineFormValues } from "@/types/vaccine";
import { useMemo, useState } from "react";
import { View } from "react-native";
import DatePicker from "react-native-date-picker";

interface VaccineFormProps {
  initialValues?: Partial<VaccineFormValues>;
  submitLabel?: string;
  onSubmit: (values: VaccineFormValues) => void;
  onDelete: () => void;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const VaccineForm = ({
  initialValues,
  submitLabel = "저장",
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
    <View className="w-full gap-4 pb-4">
      <FormControl isInvalid={hasSubmitted && !name.trim()}>
        <FormControlLabelText className="text-[#0D0F1B]">
          예방접종 이름
        </FormControlLabelText>
        <Input size="md" variant="underlined" className="mt-1 border-gray-300">
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="예: 종합백신"
            placeholderTextColor="#9CA3AF"
            className="text-[#0D0F1B]"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            예방접종 이름을 입력해주세요.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !vaccinatedAt}>
        <FormControlLabelText className="text-[#0D0F1B]">
          접종 날짜
        </FormControlLabelText>
        <Pressable
          onPress={() => setPickField("vaccinatedAt")}
          className="mt-1 rounded-xl border border-gray-300 px-3 py-3"
        >
          <Text className={vaccinatedAt ? "text-[#0D0F1B]" : "text-gray-400"}>
            {vaccinatedAt || "날짜를 선택하세요"}
          </Text>
        </Pressable>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>접종 날짜를 선택해주세요.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={hasSubmitted && !nextVaccinationAt}>
        <FormControlLabelText className="text-[#0D0F1B]">
          다음 접종일
        </FormControlLabelText>
        <Pressable
          onPress={() => setPickField("nextVaccinationAt")}
          className="mt-1 rounded-xl border border-gray-300 px-3 py-3"
        >
          <Text
            className={nextVaccinationAt ? "text-[#0D0F1B]" : "text-gray-400"}
          >
            {nextVaccinationAt || "날짜를 선택하세요"}
          </Text>
        </Pressable>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            다음 접종일을 선택해주세요.
          </FormControlErrorText>
        </FormControlError>
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
      {submitLabel === "수정" ? (
        <Button onPress={onDelete} className="mt-2 rounded-2xl bg-error-500">
          <ButtonText>삭제</ButtonText>
        </Button>
      ) : null}
    </View>
  );
};

export default VaccineForm;
