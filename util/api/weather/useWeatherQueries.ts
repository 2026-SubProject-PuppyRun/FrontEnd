import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import {
  getCurrentWeather,
  getWeatherForecast,
  type WeatherCoordParams,
  type WeatherForecastParams,
} from "./api";

type WeatherQueryOptions = {
  enabled?: boolean;
};

/**
 * 현재 날씨 React Query 훅
 *
 * @example
 * const { data, isLoading } = useCurrentWeatherQuery({ lat: 37.5, lon: 127.0 });
 */
export const useCurrentWeatherQuery = (
  { lat, lon }: WeatherCoordParams,
  { enabled = true }: WeatherQueryOptions = {},
) =>
  useQuery({
    queryKey: queryKeys.weather.current(lat, lon),
    queryFn: () => getCurrentWeather({ lat, lon }),
    enabled: enabled && Number.isFinite(lat) && Number.isFinite(lon),
    staleTime: 1000 * 60 * 10,
  });

/**
 * 초단기 예보 React Query 훅
 *
 * @example
 * const { data } = useWeatherForecastQuery({ lat: 37.5, lon: 127.0, limit: 6 });
 */
export const useWeatherForecastQuery = (
  { lat, lon, limit = 6 }: WeatherForecastParams,
  { enabled = true }: WeatherQueryOptions = {},
) =>
  useQuery({
    queryKey: queryKeys.weather.forecast(lat, lon, limit),
    queryFn: () => getWeatherForecast({ lat, lon, limit }),
    enabled: enabled && Number.isFinite(lat) && Number.isFinite(lon),
    staleTime: 1000 * 60 * 10,
  });
