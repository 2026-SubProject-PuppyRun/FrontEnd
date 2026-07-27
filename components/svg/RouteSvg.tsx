import { useRunStore } from "@/store/useRunStore";
import React from "react";
import Svg, { Polyline, Rect } from "react-native-svg";

interface Coordinate {
  latitude: number;
  longitude: number;
}

const SVG_SIZE = 280;
const PADDING = 24;

const coordsToPoints = (
  coords: Coordinate[],
  minLat: number,
  latDiff: number,
  minLng: number,
  lngDiff: number,
): string => {
  const drawable = SVG_SIZE - PADDING * 2;
  return coords
    .map(({ latitude, longitude }) => {
      const x = PADDING + ((longitude - minLng) / lngDiff) * drawable;
      const y = PADDING + (1 - (latitude - minLat) / latDiff) * drawable;
      return `${x},${y}`;
    })
    .join(" ");
};

const RouteSvg = () => {
  const route = useRunStore((state) => state.runData?.route);

  const segments: Coordinate[][] =
    route && route.length > 0 ? [route] : [];

  if (segments.length === 0 || segments.every((s) => s.length === 0)) {
    return (
      <Svg width={SVG_SIZE} height={SVG_SIZE}>
        <Rect width={SVG_SIZE} height={SVG_SIZE} fill="#0D0F1B" />
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
    <Svg width={SVG_SIZE} height={SVG_SIZE}>
      <Rect width={SVG_SIZE} height={SVG_SIZE} fill="#0D0F1B" />
      {segments.map((seg, i) => {
        if (seg.length < 2) return null;
        const points = coordsToPoints(
          seg,
          minLat,
          latDiff,
          minLng,
          lngDiff,
        );
        return (
          <Polyline
            key={i}
            points={points}
            fill="none"
            stroke="#F25857"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </Svg>
  );
};

export default RouteSvg;
