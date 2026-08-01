import { useRunStore } from "@/store/useRunStore";
import React from "react";
import Svg, { Polyline, Rect } from "react-native-svg";

interface Coordinate {
  latitude: number;
  longitude: number;
}

type RouteSvgProps = {
  size?: number;
  padding?: number;
  /** store 대신 외부에서 경로를 넘길 때 (피드 목업 등) */
  route?: Coordinate[] | null;
  /** false면 배경 없음 (셀피 오버레이용) */
  withBackground?: boolean;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  /** 셀피 위 가독성용 외곽선 */
  withOutline?: boolean;
};

const coordsToPoints = (
  coords: Coordinate[],
  minLat: number,
  latDiff: number,
  minLng: number,
  lngDiff: number,
  size: number,
  padding: number,
): string => {
  const drawable = size - padding * 2;
  return coords
    .map(({ latitude, longitude }) => {
      const x = padding + ((longitude - minLng) / lngDiff) * drawable;
      const y = padding + (1 - (latitude - minLat) / latDiff) * drawable;
      return `${x},${y}`;
    })
    .join(" ");
};

const RouteSvg = ({
  size = 280,
  padding = 24,
  route: routeProp,
  withBackground = true,
  backgroundColor = "#0D0F1B",
  strokeColor = "#F25857",
  strokeWidth = 5,
  withOutline = false,
}: RouteSvgProps) => {
  const storeRoute = useRunStore((state) => state.runData?.route);
  const route = routeProp ?? storeRoute;

  const segments: Coordinate[][] =
    route && route.length > 0 ? [route] : [];

  if (segments.length === 0 || segments.every((s) => s.length === 0)) {
    if (!withBackground) return null;
    return (
      <Svg width={size} height={size}>
        <Rect width={size} height={size} fill={backgroundColor} />
      </Svg>
    );
  }

  const allCoords = segments.flat();
  const lats = allCoords.map((c) => c.latitude);
  const lngs = allCoords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latDiff = maxLat - minLat || 0.0001;
  const lngDiff = maxLng - minLng || 0.0001;

  return (
    <Svg width={size} height={size}>
      {withBackground ? (
        <Rect width={size} height={size} fill={backgroundColor} />
      ) : null}
      {segments.map((seg, i) => {
        if (seg.length < 2) return null;
        const points = coordsToPoints(
          seg,
          minLat,
          latDiff,
          minLng,
          lngDiff,
          size,
          padding,
        );
        return (
          <React.Fragment key={i}>
            {withOutline ? (
              <Polyline
                points={points}
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={strokeWidth + 4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            <Polyline
              points={points}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

export default RouteSvg;
