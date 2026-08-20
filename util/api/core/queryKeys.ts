/**
 * React Query queryKey를 한곳에서 관리.
 * invalidateQueries({ queryKey: queryKeys.pets.all }) 형태로 사용.
 */
export const queryKeys = {
  pets: {
    all: ["pets"] as const,
    list: () => [...queryKeys.pets.all, "list"] as const,
    detail: (petId: string) => [...queryKeys.pets.all, "detail", petId] as const,
    progress: (petIds?: string[]) =>
      [...queryKeys.pets.all, "progress", petIds?.join(",") ?? "all"] as const,
  },
  walks: {
    all: ["walks"] as const,
    recentSummaries: () => [...queryKeys.walks.all, "recentSummaries"] as const,
    detail: (walkId: string) => [...queryKeys.walks.all, "detail", walkId] as const,
  },
  weather: {
    all: ["weather"] as const,
    current: (lat: number, lon: number) =>
      [...queryKeys.weather.all, "current", Math.round(lat), Math.round(lon)] as const,
    forecast: (lat: number, lon: number, limit = 6) =>
      [
        ...queryKeys.weather.all,
        "forecast",
        Math.round(lat),
        Math.round(lon),
        limit,
      ] as const,
  },
  diaries: {
    all: ["diaries"] as const,
    detail: (trackingId: string) =>
      [...queryKeys.diaries.all, "detail", trackingId] as const,
  },
  tracking: {
    all: ["tracking"] as const,
    list: () => [...queryKeys.tracking.all, "list"] as const,
    detail: (trackingId: string) =>
      [...queryKeys.tracking.all, "detail", trackingId] as const,
  },
  activityTracking: {
    all: ["activityTracking"] as const,
    monthlyContributions: (date: string) =>
      [...queryKeys.activityTracking.all, "monthlyContributions", date] as const,
    grassChart: (endDate: string) =>
      [...queryKeys.activityTracking.all, "grassChart", endDate] as const,
    weeklyChart: (weekStart: string) =>
      [...queryKeys.activityTracking.all, "weeklyChart", weekStart] as const,
    weeklyStatistics: (date: string) =>
      [...queryKeys.activityTracking.all, "weeklyStatistics", date] as const,
    dailyStatistics: (date: string) =>
      [...queryKeys.activityTracking.all, "dailyStatistics", date] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    settings: () => [...queryKeys.notifications.all, "settings"] as const,
  },
  medications: {
    all: ["medications"] as const,
    list: (petId: string) =>
      [...queryKeys.medications.all, "list", petId] as const,
  },
  weights: {
    all: ["weights"] as const,
    list: (petId: string) =>
      [...queryKeys.weights.all, "list", petId] as const,
  },
  vaccines: {
    all: ["vaccines"] as const,
    list: (petId: string) =>
      [...queryKeys.vaccines.all, "list", petId] as const,
  },
} as const;
