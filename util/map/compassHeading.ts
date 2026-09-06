/** 자기장 센서 → 지도 마커용 방위각 (0°=북, 시계 방향) */
export const magnetometerToHeading = (x: number, y: number) => {
  const angle = Math.atan2(-x, y) * (180 / Math.PI);
  return (angle + 360) % 360;
};
