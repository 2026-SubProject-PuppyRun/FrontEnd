import { apiGet } from "../core/client";

export type ActivityChartItem = {
  label: string;
  distance_km: number;
  duration_min: number;
  tracking_count: number;
};

export type MonthlyContributionsResponse = {
  period: {
    type: "contributions";
    month: string;
  };
  activity_chart: ActivityChartItem[];
};

/** 기준일이 속한 한 달의 일별 산책 기여도 조회 (date: YYYY-MM-DD) */
export const getMonthlyContributions = async (
  date: string,
): Promise<MonthlyContributionsResponse> =>
  apiGet<MonthlyContributionsResponse>(
    `/activity-tracking/statistics/monthly/contributions?date=${date}`,
  );
