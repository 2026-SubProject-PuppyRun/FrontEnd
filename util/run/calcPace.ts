export const calculatePace = (speedInMetersPerSecond: number) => {
  if (speedInMetersPerSecond <= 0) return "0'00''";

  const secondsPerKm = 1000 / speedInMetersPerSecond;

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${minutes}'${seconds.toString().padStart(2, "0")}''`;
};

/** 누적 거리·시간 기준 평균 페이스 (산책 속도에서 speed null 대비) */
export const calculatePaceFromDistanceAndTime = (
  distanceMeters: number,
  totalSeconds: number,
) => {
  if (distanceMeters <= 0 || totalSeconds <= 0) return "0'00''";

  const secondsPerKm = (totalSeconds / distanceMeters) * 1000;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${minutes}'${seconds.toString().padStart(2, "0")}''`;
};
