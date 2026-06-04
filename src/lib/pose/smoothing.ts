import type { Point3 } from "./angles";

const MAX_JUMP = 0.15;

export class LandmarkSmoother {
  private prev: Point3[] | null = null;
  private readonly alpha: number;

  constructor(alpha = 0.35) {
    this.alpha = alpha;
  }

  reset() {
    this.prev = null;
  }

  smooth(landmarks: Point3[]): Point3[] {
    if (!this.prev || this.prev.length !== landmarks.length) {
      this.prev = landmarks.map((p) => ({ ...p }));
      return this.prev;
    }
    const out: Point3[] = [];
    for (let i = 0; i < landmarks.length; i++) {
      const cur = landmarks[i];
      const p = this.prev[i];
      const dx = Math.abs(cur.x - p.x);
      const dy = Math.abs(cur.y - p.y);
      if (dx > MAX_JUMP || dy > MAX_JUMP) {
        out.push({ ...cur });
      } else {
        out.push({
          x: p.x + this.alpha * (cur.x - p.x),
          y: p.y + this.alpha * (cur.y - p.y),
          z: cur.z,
          visibility: cur.visibility,
        });
      }
    }
    this.prev = out;
    return out;
  }
}
