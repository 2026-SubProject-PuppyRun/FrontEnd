import dayjs from "dayjs";

const getWeekOfMonth = (date: dayjs.Dayjs) => {
  const firstDayOfMonth = date.startOf("month");
  const firstDayOfWeek = firstDayOfMonth.day();
  const currentDay = date.date();
  return Math.ceil((currentDay + firstDayOfWeek) / 7);
};

const weekNames = ["첫째", "둘째", "셋째", "넷째", "다섯째"];

export const getWeekName = (date: dayjs.Dayjs) => {
  const week = getWeekOfMonth(date);
  return weekNames[week - 1] || "";
};
