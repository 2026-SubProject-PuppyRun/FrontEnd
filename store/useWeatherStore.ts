import type {
  CurrentWeatherResponse,
  WeatherForecastItem,
  WeatherForecastResponse,
} from "@/util/api/weather";
import { create } from "zustand";

export type Forecast6Hour = {
  times: string[];
  temp: number[];
  sky: number[];
  pty: number[];
  /** 강수량 문구 — "강수없음", "1mm" 등 */
  pcp: string[];
};

export type CurrentWeather = {
  temp: number | null;
  sky: number | null;
  pty: number | null;
  pcp: string | null;
  date: string | null;
  time: string | null;
  regionLabel: string | null;
};

export type AirQuality = {
  pm10?: number;
  pm25?: number;
};

type WeatherStore = {
  current: CurrentWeather;
  forecast6hour: Forecast6Hour;
  air: AirQuality;
  coords: { lat: number; lon: number } | null;
  setCurrent: (data: CurrentWeather) => void;
  setForecast6Hour: (data: Forecast6Hour) => void;
  setAir: (data: AirQuality) => void;
  setCoords: (coords: { lat: number; lon: number } | null) => void;
  applyWeatherResponses: (payload: {
    current: CurrentWeatherResponse;
    forecast: WeatherForecastResponse;
    coords: { lat: number; lon: number };
  }) => void;
};

const EMPTY_CURRENT: CurrentWeather = {
  temp: null,
  sky: null,
  pty: null,
  pcp: null,
  date: null,
  time: null,
  regionLabel: null,
};

const EMPTY_FORECAST: Forecast6Hour = {
  times: [],
  temp: [],
  sky: [],
  pty: [],
  pcp: [],
};

const parseNumber = (value?: string) => {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const formatRegionLabel = (
  region: string[] | string | undefined,
): string | null => {
  if (Array.isArray(region)) {
    const label = region.filter(Boolean).join(" ").trim();
    return label || null;
  }
  return region || null;
};

export const mapCurrentWeather = (
  snapshot: CurrentWeatherResponse,
): CurrentWeather => {
  const { detail } = snapshot;
  return {
    temp: parseNumber(detail.temp),
    sky: parseNumber(detail.sky),
    pty: parseNumber(detail.pty),
    pcp: detail.pcp ?? null,
    date: snapshot.date,
    time: snapshot.time,
    regionLabel: formatRegionLabel(snapshot.region),
  };
};

export const mapForecastToStore = (
  forecasts: WeatherForecastItem[],
): Forecast6Hour => {
  const next: Forecast6Hour = {
    times: [],
    temp: [],
    sky: [],
    pty: [],
    pcp: [],
  };

  forecasts.forEach((item) => {
    next.times.push(item.time);
    next.temp.push(parseNumber(item.detail.temp) ?? 0);
    next.sky.push(parseNumber(item.detail.sky) ?? 1);
    next.pty.push(parseNumber(item.detail.pty) ?? 0);
    next.pcp.push(item.detail.pcp || "강수없음");
  });

  return next;
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  current: EMPTY_CURRENT,
  forecast6hour: EMPTY_FORECAST,
  air: {
    pm10: undefined,
    pm25: undefined,
  },
  coords: null,
  setCurrent: (data) => set({ current: data }),
  setForecast6Hour: (data) => set({ forecast6hour: data }),
  setAir: (data) => set({ air: data }),
  setCoords: (coords) => set({ coords }),
  applyWeatherResponses: ({ current, forecast, coords }) => {
    const mapped = mapCurrentWeather(current);
    set({
      current: {
        ...mapped,
        regionLabel: mapped.regionLabel ?? formatRegionLabel(forecast.region),
      },
      forecast6hour: mapForecastToStore(forecast.forecasts ?? []),
      coords,
    });
  },
}));
