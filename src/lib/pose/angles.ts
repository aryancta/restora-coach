/** MediaPipe Pose landmark indices */
export const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

export type Point3 = { x: number; y: number; z?: number; visibility?: number };

function angleAtVertex(a: Point3, vertex: Point3, c: Point3): number {
  const v1 = { x: a.x - vertex.x, y: a.y - vertex.y };
  const v2 = { x: c.x - vertex.x, y: c.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 < 1e-6 || mag2 < 1e-6) return 0;
  const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export function kneeFlexionDeg(
  landmarks: Point3[],
  side: "left" | "right"
): number {
  const hip = side === "left" ? LM.LEFT_HIP : LM.RIGHT_HIP;
  const knee = side === "left" ? LM.LEFT_KNEE : LM.RIGHT_KNEE;
  const ankle = side === "left" ? LM.LEFT_ANKLE : LM.RIGHT_ANKLE;
  return angleAtVertex(
    landmarks[hip],
    landmarks[knee],
    landmarks[ankle]
  );
}

export function shoulderAbductionDeg(
  landmarks: Point3[],
  side: "left" | "right"
): number {
  const hip = side === "left" ? LM.LEFT_HIP : LM.RIGHT_HIP;
  const shoulder = side === "left" ? LM.LEFT_SHOULDER : LM.RIGHT_SHOULDER;
  const wrist = side === "left" ? LM.LEFT_WRIST : LM.RIGHT_WRIST;
  return angleAtVertex(
    landmarks[hip],
    landmarks[shoulder],
    landmarks[wrist]
  );
}

/** Knee over toe risk: horizontal knee ahead of ankle */
export function kneeOverToeRisk(
  landmarks: Point3[],
  side: "left" | "right"
): boolean {
  const knee = side === "left" ? LM.LEFT_KNEE : LM.RIGHT_KNEE;
  const ankle = side === "left" ? LM.LEFT_ANKLE : LM.RIGHT_ANKLE;
  const k = landmarks[knee];
  const a = landmarks[ankle];
  if (!k || !a) return false;
  return k.x > a.x + 0.04;
}

export function pickVisibleSide(
  landmarks: Point3[],
  metric: "knee-flexion" | "shoulder-abduction" | "hip-flexion" | "balance-hold"
): "left" | "right" {
  const leftVis =
    (landmarks[LM.LEFT_HIP]?.visibility ?? 0) +
    (landmarks[LM.LEFT_KNEE]?.visibility ?? 0);
  const rightVis =
    (landmarks[LM.RIGHT_HIP]?.visibility ?? 0) +
    (landmarks[LM.RIGHT_KNEE]?.visibility ?? 0);
  if (metric === "shoulder-abduction") {
    const l =
      (landmarks[LM.LEFT_SHOULDER]?.visibility ?? 0) +
      (landmarks[LM.LEFT_WRIST]?.visibility ?? 0);
    const r =
      (landmarks[LM.RIGHT_SHOULDER]?.visibility ?? 0) +
      (landmarks[LM.RIGHT_WRIST]?.visibility ?? 0);
    return l >= r ? "left" : "right";
  }
  return leftVis >= rightVis ? "left" : "right";
}

export function measureAngle(
  landmarks: Point3[],
  metric: "knee-flexion" | "shoulder-abduction" | "hip-flexion" | "balance-hold",
  side: "left" | "right" | "either"
): number {
  const s =
    side === "either" ? pickVisibleSide(landmarks, metric) : side;
  switch (metric) {
    case "knee-flexion":
    case "balance-hold":
      return kneeFlexionDeg(landmarks, s);
    case "shoulder-abduction":
      return shoulderAbductionDeg(landmarks, s);
    case "hip-flexion":
      return kneeFlexionDeg(landmarks, s);
    default:
      return 0;
  }
}
