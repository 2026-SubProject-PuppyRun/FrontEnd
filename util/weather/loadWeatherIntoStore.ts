import {
  getCurrentWeather,
  getWeatherForecast,
} from "@/util/api/weather";
import { useWeatherStore } from "@/store/useWeatherStore";
import { fetchWithRetry } from "@/util/location/fetchWithRetry";

type LoadWeatherOptions = {
  lat: number;
  lon: number;
  /** OpenWeatherMap 대기질 조회 포함 (기본 true) */
  includeAir?: boolean;
};

/**
 * 현재/예보 날씨를 병렬로 가져와 WeatherStore에 반영.
 * 대기질은 OpenWeatherMap을 유지 (백엔드 미제공 시).
 */
export const loadWeatherIntoStore = async ({
  lat,
  lon,
  includeAir = true,
}: LoadWeatherOptions) => {
  const [current, forecast] = await Promise.all([
    getCurrentWeather({ lat, lon }),
    getWeatherForecast({ lat, lon, limit: 6 }),
  ]);

  useWeatherStore.getState().applyWeatherResponses({
    current,
    forecast,
    coords: { lat, lon },
  });

  if (!includeAir) return;

  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY;
  if (!apiKey) return;

  try {
    const airRes = await fetchWithRetry(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    const airData = await airRes.json();
    const components = airData?.list?.[0]?.components;
    if (components) {
      useWeatherStore.getState().setAir({
        pm10: components.pm10,
        pm25: components.pm2_5,
      });
    }
  } catch (error) {
    console.warn("대기질 조회 실패:", error);
  }
};
