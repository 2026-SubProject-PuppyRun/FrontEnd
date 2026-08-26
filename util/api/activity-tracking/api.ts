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

export type DailyTrackingImage = {
  order: number;
  image: string;
};

export type DailyTrackingItem = {
  tracking_id: string;
  started_at: string;
  ended_at: string;
  distance_m: number;
  duration_sec: number;
  average_pace: string;
  diary: DailyTrackingDiary;
  tracking_images: DailyTrackingImage[];
  participating_pets: DailyParticipatingPet[];
};

export type DailyStatisticsSummary = {
  total_distance_m: number;
  total_duration_sec: number;
  walk_count: number;
};

export type DailyStatisticsResponse = {
  date: string;
  summary: DailyStatisticsSummary;
  tracking: DailyTrackingItem[];
};

export type MonthlySummaryItem = {
  label: string;
  total_distance_m: number;
  total_duration_sec: number;
  total_count: number;
};

export type MonthlyContributionDay = {
  label: string;
  distance_m: number;
  duration_sec: number;
  tracking_count: number;
};

export type MonthlyStatisticsResponse = {
  period: {
    type: "monthly";
    year: string;
  };
  monthly_summary: MonthlySummaryItem[];
  contribution_chart: MonthlyContributionDay[];
};

/** 기준 연도의 월별 통계와 최근 15주 일별 기여도 조회 (date: YYYY-MM-DD) */
export const getMonthlyStatistics = async (
  date: string,
): Promise<MonthlyStatisticsResponse> =>
  apiGet<MonthlyStatisticsResponse>(
    `/activity-tracking/statistics/monthly?date=${date}`,
  );

export type PetLastTrackingActivity = {
  tracking_id: string;
  started_at: string;
  ended_at: string;
  distance_m: number;
  duration_sec: number;
  average_pace: string;
};

export type PetLastTrackingItem = {
  pet_id: string;
  pet_name: string;
  pet_profile_url: string | null;
  latest_activity: PetLastTrackingActivity | null;
};

export type PetLastTrackingResponse = {
  activities: PetLastTrackingItem[];
};

/** 펫별 마지막 산책 기록 조회 (startDate/endDate: YYYY-MM-DD) */
export const getPetLastTrackings = async (
  startDate: string,
  endDate: string,
): Promise<PetLastTrackingResponse> =>
  apiGet<PetLastTrackingResponse>(
    `/activity-tracking/statistics/pet/last-tracking?startDate=${startDate}&endDate=${endDate}`,
  );

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
  distance_m: number;
  duration_sec: number;
};

export type WeeklyDogStat = {
  dog_id: string;
  name: string;
  profile_image_url: string | null;
  theme_color: string;
  distance_m: number;
  duration_sec: number;
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
    total_distance_m: number;
    total_duration_sec: number;
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
