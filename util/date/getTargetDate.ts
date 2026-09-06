export const getTargetDate = (selectedDayLabel: string, timeDate: Date) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const targetDayOfWeek = days.indexOf(selectedDayLabel);

  const now = new Date();

  // 1. 시간 세팅 (DatePicker에서 가져온 시, 분을 오늘 날짜에 세팅)
  const targetDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    timeDate.getHours(),
    timeDate.getMinutes(),
    0,
  );

  // 2. 요일 맞추기 (선택한 요일이 되려면 며칠을 더해야 하는지 계산)
  const daysToAdd = (targetDayOfWeek + 7 - now.getDay()) % 7;
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  // 3. 만약 '오늘'인데 이미 지나간 시간이라면 다음주(+7일)로 미룸
  if (daysToAdd === 0 && targetDate.getTime() <= now.getTime()) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  return targetDate;
};
