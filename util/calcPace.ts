export const calculatePace = (speedInMetersPerSecond: number) => {
  if (speedInMetersPerSecond <= 0) return "0'00''";

  const secondsPerKm = 1000 / speedInMetersPerSecond;

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${minutes}'${seconds.toString().padStart(2, "0")}''`;
};
