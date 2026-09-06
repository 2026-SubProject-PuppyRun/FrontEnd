/** 350° → 10° 회전 시 shortest path */
export const getShortestAngleDelta = (from: number, to: number) => {
  const delta = ((to - from + 540) % 360) - 180;
  return delta;
};
