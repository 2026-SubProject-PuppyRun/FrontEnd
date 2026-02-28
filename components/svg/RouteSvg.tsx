import React from "react";
import Svg, { Polyline } from "react-native-svg";

const dummyRouteData = [
  [
    { latitude: 37.16024976004391, longitude: 127.05596863884455 },
    { latitude: 37.15989961393599, longitude: 127.05762014831095 },
    { latitude: 37.15917190738391, longitude: 127.05919131757969 },
    { latitude: 37.1584342485709, longitude: 127.0610183222525 },
    { latitude: 37.158341473416584, longitude: 127.06252489379744 },
    { latitude: 37.15722905023573, longitude: 127.06248432612614 },
    { latitude: 37.1572691487399, longitude: 127.06030205274038 },
    { latitude: 37.156928161853386, longitude: 127.06027347933548 },
    { latitude: 37.157153355344136, longitude: 127.05888067131497 },
    { latitude: 37.15755271295674, longitude: 127.0578815377782 },
    { latitude: 37.15806888054634, longitude: 127.05669804585852 },
    { latitude: 37.15821334977841, longitude: 127.05521554987001 },
    { latitude: 37.1582298669273, longitude: 127.0542942425584 },
    { latitude: 37.16012184770064, longitude: 127.05427246142739 },
    { latitude: 37.16027650234487, longitude: 127.05588993045222 },
  ],
];

const RouteSvg = () => {
  //   const coordinates = useRunStore((state) => state.runData?.route!);
  const coordinates = dummyRouteData[0];
  const lats = coordinates.map((coord) => coord.latitude);
  const lngs = coordinates.map((coord) => coord.longitude);
  const svgWidth = 300;
  const svgHeight = 300;
  const padding = 30;

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // 차이가 0일 경우(점이 하나일 때) 예외 처리 방지용
  const latDiff = maxLat - minLat || 1;
  const lngDiff = maxLng - minLng || 1;

  const drawableWidth = svgWidth - padding * 2;
  const drawableHeight = svgHeight - padding * 2;

  // 2. 위경도 좌표를 SVG의 X, Y 좌표로 변환 (여백 적용)
  const points = coordinates
    .map((coord) => {
      // 비율 계산 (0 ~ 1)
      const ratioX = (coord.longitude - minLng) / lngDiff;
      const ratioY = (coord.latitude - minLat) / latDiff;

      const x = padding + ratioX * drawableWidth;

      const y = padding + drawableHeight - ratioY * drawableHeight;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      style={{ backgroundColor: "#1A0F0A" }}
    >
      <Polyline
        points={points}
        fill="none"
        stroke="blue"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default RouteSvg;
