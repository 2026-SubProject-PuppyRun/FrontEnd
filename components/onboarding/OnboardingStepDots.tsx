import { View } from "react-native";

const TOTAL_STEPS = 4;

type OnboardingStepDotsProps = {
  current: number;
};

const OnboardingStepDots = ({ current }: OnboardingStepDotsProps) => (
  <View className="flex-row items-center justify-center gap-2">
    {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
      <View
        key={index}
        className={
          index === current
            ? "h-2 w-6 rounded-full bg-[#F25857]"
            : "h-2 w-2 rounded-full bg-[#F25857]/25"
        }
      />
    ))}
  </View>
);

export default OnboardingStepDots;
