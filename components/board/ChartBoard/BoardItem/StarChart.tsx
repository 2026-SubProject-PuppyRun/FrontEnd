import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { resolveDogColor, useWeeklyStatisticsQuery } from "@/util/api/activity-tracking";
import { Ionicons } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { Image, View } from "react-native";
import DogRadarPanel from "./DogRadarPanel";

type StarChartProps = {
  referenceDate: Dayjs;
};

const RadarLegend = () => (
  <View className="mt-2 flex-row justify-end gap-4 pr-1">
    <View className="flex-row items-center">
      <View className="mr-2 h-3.5 w-3.5 rounded-full bg-[#FFB3B2]" />
      <Text className="text-sm text-gray-500">지난 주</Text>
    </View>
    <View className="flex-row items-center">
      <View className="mr-2 h-3.5 w-3.5 rounded-full bg-[#F25857]" />
      <Text className="text-sm text-gray-500">이번 주</Text>
    </View>
  </View>
);

const StarChart = ({ referenceDate }: StarChartProps) => {
  const { data, isLoading } = useWeeklyStatisticsQuery(referenceDate);

  if (isLoading) {
    return (
      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <ChartSkeleton />
      </View>
    );
  }

  const dogRadars = data?.dog_radars ?? [];

  if (!dogRadars.length) {
    return (
      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-center text-sm text-gray-500">
          이번 주 활동 비교 데이터가 없어요.
        </Text>
      </View>
    );
  }

  const periodLabel = data
    ? `${dayjs(data.period.start_date).format("M/D")} ~ ${dayjs(data.period.end_date).format("M/D")}`
    : "";

  if (dogRadars.length === 1) {
    return (
      <View className="rounded-3xl bg-white p-5 shadow-sm">
        {periodLabel ? (
          <Text className="mb-3 text-xs text-gray-500">{periodLabel}</Text>
        ) : null}
        <DogRadarPanel dog={dogRadars[0]} />
        <RadarLegend />
      </View>
    );
  }

  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      {periodLabel ? (
        <Text className="mb-3 text-xs text-gray-500">{periodLabel}</Text>
      ) : null}

      <Accordion
        size="md"
        variant="unfilled"
        type="single"
        isCollapsible
        defaultValue={[dogRadars[0].dog_id]}
        className="w-full gap-2"
      >
        {dogRadars.map((dog, index) => {
          const color = resolveDogColor(dog.theme_color, index);

          return (
            <AccordionItem
              key={dog.dog_id}
              value={dog.dog_id}
              className="overflow-hidden rounded-2xl border border-[#F0F0F5] bg-[#FAFAFC]"
            >
              <AccordionHeader>
                <AccordionTrigger className="px-4 py-3.5">
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      {dog.profile_image_url ? (
                        <Image
                          source={{ uri: dog.profile_image_url }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            marginRight: 10,
                          }}
                        />
                      ) : (
                        <View
                          className="mr-2.5 h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${color}22` }}
                        >
                          <Text
                            className="text-xs font-bold"
                            style={{ color }}
                          >
                            {dog.dog_name.slice(0, 1)}
                          </Text>
                        </View>
                      )}
                      <AccordionTitleText className="flex-1 text-base font-semibold text-[#0D0F1B]">
                        {dog.dog_name}
                      </AccordionTitleText>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#9CA3AF"
                      />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="px-2 pb-4">
                <DogRadarPanel dog={dog} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <RadarLegend />
    </View>
  );
};

export default StarChart;
