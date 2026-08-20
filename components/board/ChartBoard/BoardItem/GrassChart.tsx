import { Text } from "@/components/ui/text";
import {
  GRASS_CHART_DAYS,
  useGrassChartContributionsQuery,
} from "@/util/api/activity-tracking";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

const CELL_SIZE = 12;
const CELL_GAP = 3;
const DAYS_PER_COLUMN = 7;
const WEEKDAY_LABEL_WIDTH = 22;
const MONTH_LABEL_HEIGHT = 18;

/** 일요일=0 … 토요일=6 기준 행 라벨 (월·수·금만 표시) */
const WEEKDAY_LABELS = ["", "월", "", "수", "", "금", ""];

const getColorByCount = (count: number) => {
  if (count === 0) return "bg-[#E8E8ED]";
  if (count === 1) return "bg-[#FADADD]";
  if (count === 2) return "bg-[#F5A3A3]";
  return "bg-[#F25857]";
};

/** 최근 GRASS_CHART_DAYS일을 주(일~토) 단위 열로 정렬 */
const buildWeekColumns = (endDate: Dayjs): Dayjs[][] => {
  const startDate = endDate.subtract(GRASS_CHART_DAYS - 1, "day");
  const rangeStart = startDate.subtract(startDate.day(), "day"); // 해당 주 일요일
  const rangeEnd = endDate.add(6 - endDate.day(), "day"); // 해당 주 토요일

  const columns: Dayjs[][] = [];
  let cursor = rangeStart;

  while (cursor.isBefore(rangeEnd) || cursor.isSame(rangeEnd, "day")) {
    const week: Dayjs[] = [];
    for (let i = 0; i < DAYS_PER_COLUMN; i++) {
      week.push(cursor.add(i, "day"));
    }
    columns.push(week);
    cursor = cursor.add(1, "week");
  }

  return columns;
};

/** 열 위에 붙일 월 라벨 (해당 주에서 월이 바뀌는 첫 열만) */
const getMonthLabelForColumn = (
  week: Dayjs[],
  columnIndex: number,
  columns: Dayjs[][],
  chartStart: Dayjs,
  chartEnd: Dayjs,
): string | null => {
  const inRangeDay = week.find(
    (d) =>
      (d.isAfter(chartStart, "day") || d.isSame(chartStart, "day")) &&
      (d.isBefore(chartEnd, "day") || d.isSame(chartEnd, "day")),
  );
  if (!inRangeDay) return null;

  const monthKey = inRangeDay.format("YYYY-MM");
  if (columnIndex > 0) {
    const prevWeek = columns[columnIndex - 1];
    const prevInRange = prevWeek.find(
      (d) =>
        (d.isAfter(chartStart, "day") || d.isSame(chartStart, "day")) &&
        (d.isBefore(chartEnd, "day") || d.isSame(chartEnd, "day")),
    );
    if (prevInRange?.format("YYYY-MM") === monthKey) return null;
  }

  return inRangeDay.locale("ko").format("M월");
};

const GrassChart = () => {
  const { data, isLoading } = useGrassChartContributionsQuery();

  const { columns, chartStart, chartEnd } = useMemo(() => {
    const end = dayjs().startOf("day");
    const start = end.subtract(GRASS_CHART_DAYS - 1, "day");
    return {
      columns: buildWeekColumns(end),
      chartStart: start,
      chartEnd: end,
    };
  }, []);

  const monthLabels = useMemo(
    () =>
      columns.map((week, index) =>
        getMonthLabelForColumn(week, index, columns, chartStart, chartEnd),
      ),
    [columns, chartStart, chartEnd],
  );

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 4 }}
      >
        <View>
          {/* 월 라벨 행 */}
          <View
            className="mb-1 flex-row"
            style={{ marginLeft: WEEKDAY_LABEL_WIDTH }}
          >
            {columns.map((_, columnIndex) => {
              const label = monthLabels[columnIndex];
              return (
                <View
                  key={`month-${columnIndex}`}
                  style={{
                    width: CELL_SIZE + CELL_GAP,
                    height: MONTH_LABEL_HEIGHT,
                    marginRight: 0,
                  }}
                >
                  {label ? (
                    <Text
                      className="text-[10px] font-semibold text-[#6B6F80]"
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View className="flex-row">
            {/* 요일 라벨 */}
            <View
              style={{
                width: WEEKDAY_LABEL_WIDTH,
                gap: CELL_GAP,
                paddingTop: 0,
              }}
            >
              {WEEKDAY_LABELS.map((label, rowIndex) => (
                <View
                  key={`weekday-${rowIndex}`}
                  className="justify-center"
                  style={{ height: CELL_SIZE }}
                >
                  {label ? (
                    <Text className="text-[10px] text-[#9AA0B0]">{label}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            {/* 잔디 그리드 */}
            <View className="flex-row" style={{ gap: CELL_GAP }}>
              {columns.map((week, columnIndex) => (
                <View key={`col-${columnIndex}`} style={{ gap: CELL_GAP }}>
                  {week.map((day) => {
                    const dateKey = day.format("YYYY-MM-DD");
                    const inRange =
                      (day.isAfter(chartStart, "day") ||
                        day.isSame(chartStart, "day")) &&
                      (day.isBefore(chartEnd, "day") ||
                        day.isSame(chartEnd, "day"));

                    if (!inRange) {
                      return (
                        <View
                          key={dateKey}
                          style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        />
                      );
                    }

                    const count = isLoading ? 0 : (data?.[dateKey] ?? 0);

                    return (
                      <View
                        key={dateKey}
                        className={`rounded-[3px] ${getColorByCount(count)}`}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 범례 */}
      <View className="mt-3 flex-row items-center justify-end gap-1.5 pr-1">
        <Text className="mr-1 text-[10px] text-[#9AA0B0]">적음</Text>
        {[0, 1, 2, 3].map((level) => (
          <View
            key={level}
            className={`rounded-[3px] ${getColorByCount(level)}`}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          />
        ))}
        <Text className="ml-1 text-[10px] text-[#9AA0B0]">많음</Text>
      </View>
    </View>
  );
};

export default GrassChart;
