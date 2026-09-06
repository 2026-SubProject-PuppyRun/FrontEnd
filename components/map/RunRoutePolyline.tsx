import React from "react";
import { StyleSheet, View } from "react-native";
import { LatLng, Marker, Polyline } from "react-native-maps";

export const RUN_ROUTE_COLOR = "#F25857";
export const RUN_ROUTE_OUTLINE_COLOR = "rgba(255, 255, 255, 0.94)";
export const RUN_ROUTE_STROKE_WIDTH = 7;
export const RUN_ROUTE_OUTLINE_EXTRA = 6;

interface RunRoutePolylineProps {
  coordinates: LatLng[];
  strokeColor?: string;
  outlineColor?: string;
  strokeWidth?: number;
  showEndpoints?: boolean;
}

const EndpointDot = ({ color }: { color: string }) => (
  <View style={[styles.endpoint, { backgroundColor: color }]} />
);

const RunRoutePolyline = ({
  coordinates,
  strokeColor = RUN_ROUTE_COLOR,
  outlineColor = RUN_ROUTE_OUTLINE_COLOR,
  strokeWidth = RUN_ROUTE_STROKE_WIDTH,
  showEndpoints = false,
}: RunRoutePolylineProps) => {
  if (coordinates.length < 2) return null;

  const outlineWidth = strokeWidth + RUN_ROUTE_OUTLINE_EXTRA;
  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];

  return (
    <>
      <Polyline
        coordinates={coordinates}
        strokeColor={outlineColor}
        strokeWidth={outlineWidth}
        lineCap="round"
        lineJoin="round"
        geodesic
        zIndex={1}
      />
      <Polyline
        coordinates={coordinates}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        geodesic
        zIndex={2}
      />
      {showEndpoints && start ? (
        <Marker
          coordinate={start}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={3}
          tracksViewChanges={false}
        >
          <EndpointDot color="#34D399" />
        </Marker>
      ) : null}
      {showEndpoints && end ? (
        <Marker
          coordinate={end}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={3}
          tracksViewChanges={false}
        >
          <EndpointDot color={strokeColor} />
        </Marker>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  endpoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default RunRoutePolyline;
