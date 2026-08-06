import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** sky 코드 → 한글 라벨 */
export const getSkyLabel = (sky: number | null | undefined) => {
  switch (sky) {
    case 1:
      return "맑음";
    case 3:
      return "구름 많음";
    case 4:
      return "흐림";
    default:
      return "날씨 정보 없음";
  }
};

/** pty 우선, 없으면 sky 기준 아이콘 */
export const getWeatherIcon = (
  sky: number | null | undefined,
  pty: number | null | undefined,
): IoniconName => {
  switch (pty) {
    case 1:
    case 5:
      return "rainy";
    case 2:
    case 6:
      return "rainy";
    case 3:
    case 7:
      return "snow";
    default:
      break;
  }

  switch (sky) {
    case 1:
      return "sunny";
    case 3:
      return "partly-sunny";
    case 4:
      return "cloudy";
    default:
      return "cloudy";
  }
};

/** HHmm → "1시" */
export const formatWeatherHour = (time: string) => {
  const hour = Number(time.slice(0, 2));
  if (!Number.isFinite(hour)) return time;
  return `${hour}시`;
};

export const formatTemp = (temp: number | null | undefined) => {
  if (temp == null || !Number.isFinite(temp)) return "-";
  return `${Math.round(temp)}°`;
};
