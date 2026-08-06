import { apiGet } from "../core/client";

/**
 * 기상청 sky 코드
 * "1" 맑음 | "3" 구름많음 | "4" 흐림
 */
export type WeatherSkyCode = "1" | "3" | "4" | string;

/**
 * 기상청 pty(강수형태) 코드
 * "0" 없음 | "1" 비 | "2" 비/눈 | "3" 눈 | "5" 빗방울 | "6" 빗방울날림 | "7" 눈날림
 */
export type WeatherPtyCode = "0" | "1" | "2" | "3" | "5" | "6" | "7" | string;

/** 백엔드 대표 권역 코드 (17개) */
export type WeatherRegionCode =
  | "SEOUL"
  | "BUSAN"
  | "DAEGU"
  | "INCHEON"
  | "GWANGJU"
  | "DAEJEON"
  | "ULSAN"
  | "SEJONG"
  | "GYEONGGI"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "JEONBUK"
  | "JEONNAM"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "JEJU"
  | string;

/** 초단기 날씨 detail (백엔드 응답) */
export type WeatherDetail = {
  temp: string;
  sky: WeatherSkyCode;
  pty: WeatherPtyCode;
  /** 강수량 문구 — 예: "강수없음", "1mm" */
  pcp: string;
};

export type WeatherForecastItem = {
  /** YYYYMMDD */
  date: string;
  /** HHmm */
  time: string;
  detail: WeatherDetail;
};

export type WeatherForecastResponse = {
  region: string[];
  forecasts: WeatherForecastItem[];
};

/** 현재 날씨 — forecast item과 동일 detail + 상위 region */
export type CurrentWeatherResponse = {
  region: string[];
  date: string;
  time: string;
  detail: WeatherDetail;
};

export type WeatherCoordParams = {
  /** 위도 — API는 정수만 허용 */
  lat: number;
  /** 경도 — API는 정수만 허용 */
  lon: number;
};

export type WeatherForecastParams = WeatherCoordParams & {
  /** 최대 예보 건수 (기본 6) */
  limit?: number;
};

/** 실수 좌표 → API용 정수 좌표 */
export const toWeatherCoord = (value: number) => Math.round(value);

const buildWeatherQuery = ({ lat, lon, limit }: WeatherForecastParams) => {
  const params = new URLSearchParams({
    lat: String(toWeatherCoord(lat)),
    lon: String(toWeatherCoord(lon)),
  });
  if (limit != null) {
    params.set("limit", String(limit));
  }
  return params.toString();
};

/**
 * 현재 날씨 1건 조회
 * GET /weather/current?lat=&lon=
 *
 * @example
 * const weather = await getCurrentWeather({ lat: 37.5, lon: 127.0 });
 */
export const getCurrentWeather = ({ lat, lon }: WeatherCoordParams) =>
  apiGet<CurrentWeatherResponse>(
    `/weather/current?${buildWeatherQuery({ lat, lon })}`,
  );

/**
 * 초단기 예보 조회 (시간순, 최대 6건)
 * GET /weather/forecast?lat=&lon=&limit=6
 *
 * @example
 * const { forecasts } = await getWeatherForecast({ lat: 37.5, lon: 127.0, limit: 6 });
 */
export const getWeatherForecast = ({
  lat,
  lon,
  limit = 6,
}: WeatherForecastParams) => {
  return apiGet<WeatherForecastResponse>(
    `/weather/forecast?${buildWeatherQuery({ lat, lon, limit })}`,
  );
};
