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

export type DailyTrackingDiary = {
  has_diary: boolean;
  diary_id: string | null;
};

export type DailyParticipatingPet = {
  pet_id: string;
  name: string;
  profile_image_url: string | null;
  theme_color: string;
};

export type DailyTrackingItem = {
  tracking_id: string;
  started_at: string;
  ended_at: string;
  distance_km: number;
  duration_min: number;
  average_pace: string;
  diary: DailyTrackingDiary;
  tracking_images: string[];
  participating_pets: DailyParticipatingPet[];
};

export type DailyStatisticsSummary = {
  total_distance_km: number;
  total_duration_min: number;
  walk_count: number;
};

export type DailyStatisticsResponse = {
  date: string;
  summary: DailyStatisticsSummary;
  tracking: DailyTrackingItem[];
};

/** 기준일이 속한 한 달의 일별 산책 기여도 조회 (date: YYYY-MM-DD) */
export const getMonthlyContributions = async (
  date: string,
): Promise<MonthlyContributionsResponse> =>
  apiGet<MonthlyContributionsResponse>(
    `/activity-tracking/statistics/monthly/contributions?date=${date}`,
  );

/** 지정한 하루의 요약과 개별 산책 기록 조회 (date: YYYY-MM-DD) */
export const getDailyStatistics = async (
  date: string,
): Promise<DailyStatisticsResponse> =>
  apiGet<DailyStatisticsResponse>(
    `/activity-tracking/statistics/daily?date=${date}`,
  );

export type WeeklyActivityChartItem = {
  date: string;
  label: string;
  distance_km: number;
  duration_min: number;
};

export type WeeklyDogStat = {
  dog_id: string;
  name: string;
  profile_image_url: string | null;
  theme_color: string;
  distance_km: number;
  duration_min: number;
  share_percentage: number;
  total_count: number;
  badge: string;
};

export type WeeklyRadarDataPoint = {
  metric_code: string;
  label: string;
  this_week_value: number;
  last_week_value: number;
  max_score: number;
};

export type WeeklyDogRadar = {
  dog_id: string;
  dog_name: string;
  profile_image_url: string | null;
  theme_color: string;
  data_points: WeeklyRadarDataPoint[];
};

export type WeeklyStatisticsResponse = {
  period: {
    type: "weekly";
    start_date: string;
    end_date: string;
  };
  summary: {
    total_distance_km: number;
    total_duration_min: number;
    total_count: number;
  };
  activity_chart: WeeklyActivityChartItem[];
  family_report: {
    total_dogs: number;
    dog_stats: WeeklyDogStat[];
  };
  dog_radars: WeeklyDogRadar[];
};

/** 기준일 포함 최근 7일 주간 통계 (date: YYYY-MM-DD) */
export const getWeeklyStatistics = async (
  date: string,
): Promise<WeeklyStatisticsResponse> =>
  apiGet<WeeklyStatisticsResponse>(
    `/activity-tracking/statistics/weekly?date=${date}`,
  );
