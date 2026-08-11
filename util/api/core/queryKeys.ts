/**
 * React Query queryKey를 한곳에서 관리.
 * invalidateQueries({ queryKey: queryKeys.pets.all }) 형태로 사용.
 */
export const queryKeys = {
  pets: {
    all: ["pets"] as const,
    list: () => [...queryKeys.pets.all, "list"] as const,
    detail: (petId: string) => [...queryKeys.pets.all, "detail", petId] as const,
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
  },
} as const;
