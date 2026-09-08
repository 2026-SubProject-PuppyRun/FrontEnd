/**
 * 350° → 10° 회전 시 shortest path.
 *
 * from은 누적 회전값이라 [0,360)을 벗어난다.
 * 먼저 360으로 접어야 from-to가 540을 넘길 때 반대로 크게 도는 걸 막을 수 있다.
 */
export const getShortestAngleDelta = (from: number, to: number) => {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return delta;
};
