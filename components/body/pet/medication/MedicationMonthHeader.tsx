import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icon";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Dayjs } from "dayjs";

interface MedicationMonthHeaderProps {
  month: Dayjs;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const MedicationMonthHeader = ({
  month,
  onPrev,
  onNext,
  onToday,
}: MedicationMonthHeaderProps) => (
  <HStack className="items-center justify-between px-2 pb-2 pt-2">
    <Pressable
      onPress={onPrev}
      accessibilityRole="button"
      accessibilityLabel="이전 달"
      className="h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7] active:opacity-70"
    >
      <Icon as={ChevronLeftIcon} size="lg" className="text-[#0D0F1B]" />
    </Pressable>

    <Pressable onPress={onToday} accessibilityRole="button">
      <Text className="text-base font-bold text-[#0D0F1B]">
        {month.format("YYYY년 M월")}
      </Text>
    </Pressable>

    <Pressable
      onPress={onNext}
      accessibilityRole="button"
      accessibilityLabel="다음 달"
      className="h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7] active:opacity-70"
    >
      <Icon as={ChevronRightIcon} size="lg" className="text-[#0D0F1B]" />
    </Pressable>
  </HStack>
);

export default MedicationMonthHeader;
