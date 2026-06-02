import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icon";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Dayjs } from "dayjs";

interface DietMonthHeaderProps {
  month: Dayjs;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const DietMonthHeader = ({
  month,
  onPrev,
  onNext,
  onToday,
}: DietMonthHeaderProps) => (
  <HStack className="items-center justify-between px-4 pb-2 pt-4">
    <Pressable
      onPress={onPrev}
      accessibilityRole="button"
      accessibilityLabel="이전 달"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
    >
      <Icon as={ChevronLeftIcon} size="xl" className="text-primary-500" />
    </Pressable>

    <Pressable onPress={onToday} accessibilityRole="button">
      <Text className="text-xl font-bold text-[#0D0F1B]">
        {month.format("YYYY년 M월")}
      </Text>
    </Pressable>

    <Pressable
      onPress={onNext}
      accessibilityRole="button"
      accessibilityLabel="다음 달"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
    >
      <Icon as={ChevronRightIcon} size="xl" className="text-primary-500" />
    </Pressable>
  </HStack>
);

export default DietMonthHeader;
