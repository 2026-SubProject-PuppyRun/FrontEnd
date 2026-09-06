import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { getWalkGradeInfo } from "@/constants/walkGrade";
import type { PetProgress } from "@/util/api/pets";
import React from "react";
import { View } from "react-native";

type WalkGradePanelProps = {
  progress: PetProgress;
};

const WalkGradePanel = ({ progress }: WalkGradePanelProps) => {
  const grade = getWalkGradeInfo(progress.trackingProgress);

  return (
    <View>
      <Text className="text-center text-xl font-bold text-[#0D0F1B]">
        {grade.name}
      </Text>
      <Text className="mt-1 text-center text-sm text-gray-500">
        다음 등급까지 {grade.remainingPercent}% 남았어요
      </Text>

      <View className="mt-4">
        <Progress className="h-2.5 w-full" size="sm" value={grade.progressPercent}>
          <ProgressFilledTrack className="rounded-full bg-primary-500" />
        </Progress>
        <View className="mt-1 flex-row justify-between">
          <Text className="text-xs text-gray-400">Lv.{grade.level}</Text>
          <Text className="text-xs font-semibold text-primary-500">
            {grade.progressPercent}%
          </Text>
          <Text className="text-xs text-gray-400">Lv.{grade.nextLevel}</Text>
        </View>
      </View>
    </View>
  );
};

export default WalkGradePanel;
