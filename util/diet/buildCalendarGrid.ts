import { CalendarDayCell } from "@/types/diet";
import dayjs, { Dayjs } from "dayjs";

const WEEK_STARTS_ON_SUNDAY = 0;

export const buildCalendarGrid = (month: Dayjs): CalendarDayCell[] => {
  const startOfMonth = dayjs(month).startOf("month");
  const daysInMonth = startOfMonth.daysInMonth();
  const leadingEmpty = startOfMonth.day() - WEEK_STARTS_ON_SUNDAY;
  const today = dayjs().format("YYYY-MM-DD");
  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < leadingEmpty; i += 1) {
    const date = startOfMonth.add(i - leadingEmpty, "day");
    const dateKey = date.format("YYYY-MM-DD");
    cells.push({
      date: dateKey,
      day: date.date(),
      isCurrentMonth: false,
      isToday: dateKey === today,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = startOfMonth.add(day - 1, "day");
    const dateKey = date.format("YYYY-MM-DD");
    cells.push({
      date: dateKey,
      day,
      isCurrentMonth: true,
      isToday: dateKey === today,
    });
  }

  while (cells.length % 7 !== 0) {
    const lastDate = cells[cells.length - 1].date!;
    const next = dayjs(lastDate).add(1, "day");
    const dateKey = next.format("YYYY-MM-DD");
    cells.push({
      date: dateKey,
      day: next.date(),
      isCurrentMonth: false,
      isToday: dateKey === today,
    });
  }

  return cells;
};
