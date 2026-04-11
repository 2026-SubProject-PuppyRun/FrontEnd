import { create } from "zustand";

interface WeatherData {
  forecast6hour: {
    temp: number[]; // 6시간 동안 예보 온도
    sky: number[]; // 6시간 동안 예보 하늘 상태 (예: 맑음, 구름 많음 등)
    //"1"	SUNNY	맑음
    //"3"	CLOUDY	구름많음
    //"4"	OVERCAST	흐림
    pop: number[]; // 6시간 동안 예보 강수 확률
    pty: number[]; // 6시간 동안 예보 강수 형태 (예: 비, 눈 등)
    //"0"	NONE	없음
    //"1"	RAIN	비
    //"2"	RAIN_SNOW	비/눈 (진눈깨비)
    //"3"	SNOW	눈
    //"5"	RAINDROP	빗방울
    //"6"	RAINDROP_SNOW_DRIFT	빗방울날림
    //"7"	SNOW_DRIFT	눈날림
    minTemp: number[]; // 6시간 동안 예보 최저 온도
    maxTemp: number[]; // 6시간 동안 예보 최고 온도
  };
  air: {
    pm10?: number; // 미세먼지 농도
    pm25?: number; // 초미세먼지 농도
  };
  setForecast6Hour: (data: WeatherData["forecast6hour"]) => void;
  setAir: (data: WeatherData["air"]) => void;
}

export const useWeatherStore = create<WeatherData>((set) => ({
  forecast6hour: {
    temp: [],
    sky: [],
    pop: [],
    pty: [],
    minTemp: [],
    maxTemp: [],
  },
  air: {
    pm10: undefined,
    pm25: undefined,
  },
  setForecast6Hour: (data) => set({ forecast6hour: data }),
  setAir: (data) => set({ air: data }),
}));
