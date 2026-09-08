export type Vec3 = { x: number; y: number; z: number };

const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;

const normalize = (v: Vec3): Vec3 | null => {
  const n = Math.hypot(v.x, v.y, v.z);
  if (n < 1e-6) return null;
  return { x: v.x / n, y: v.y / n, z: v.z / n };
};

/** 기기 상단(+Y) */
const DEVICE_TOP: Vec3 = { x: 0, y: 1, z: 0 };

/** 화면 뒤쪽 = 카메라가 보는 방향(-Z) */
const DEVICE_BACK: Vec3 = { x: 0, y: 0, z: -1 };

/**
 * 눕힘/세움 판정 기준.
 *
 * 기기를 평평한 상태에서 θ만큼 세우면
 * +Y의 수평 투영은 cosθ, -Z의 수평 투영은 sinθ가 된다.
 * 두 값이 같아지는 45°(cos45 = √½)에서 더 안정적인 축으로 갈아탄다.
 * 이 지점에서는 두 축의 방위각이 일치하므로 전환 시 값이 튀지 않는다.
 */
const FLAT_THRESHOLD = Math.SQRT1_2;

/**
 * 가속도계·자력계로 방위각(0°=북, 시계 방향)을 구한다.
 *
 * SensorManager.getOrientation의 azimuth는 항상 +Y 기준이라
 * 폰을 세워 들면 +Y의 수평 투영이 0에 수렴해 각도가 폭주한다(gimbal lock).
 * 기울기를 보고 기준축을 +Y(눕힘) / -Z(세움)로 바꿔 그 구간을 피한다.
 *
 * 축 방향은 안드로이드 기기 좌표계(+X 오른쪽, +Y 상단, +Z 화면 바깥) 기준.
 *
 * @param gravity 중력 방향 (저역통과된 가속도계 값, 정지 시 위를 향함)
 * @param magnetic 자기장 벡터
 * @returns 0~360, 계산 불가 시 null
 */
export const computeTiltCompensatedHeading = (
  gravity: Vec3,
  magnetic: Vec3,
): number | null => {
  const up = normalize(gravity);
  if (!up) return null;

  // Android getRotationMatrix와 동일한 구성: East = m × a, North = up × East
  const east = normalize(cross(magnetic, gravity));
  if (!east) return null;
  const north = cross(up, east);

  // up.z = 화면 법선이 위를 향하는 정도 (눕힘 1, 세움 0)
  const reference =
    Math.abs(up.z) > FLAT_THRESHOLD ? DEVICE_TOP : DEVICE_BACK;

  const e = dot(reference, east);
  const n = dot(reference, north);
  if (Math.abs(e) < 1e-9 && Math.abs(n) < 1e-9) return null;

  return ((Math.atan2(e, n) * 180) / Math.PI + 360) % 360;
};
