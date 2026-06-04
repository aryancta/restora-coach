import type { ExerciseDefinition } from "@/lib/exercises";
import {
  kneeOverToeRisk,
  measureAngle,
  pickVisibleSide,
  type Point3,
} from "./angles";
import type { LiveFormState } from "@/types";

type Phase = "up" | "down";

export class RepDetector {
  private phase: Phase = "up";
  private repCount = 0;
  private safeReps = 0;
  private rangeSamples: number[] = [];
  private warnings: Set<string> = new Set();
  private lastRepAt = 0;
  private readonly cooldownMs = 900;

  constructor(private readonly exercise: ExerciseDefinition) {}

  reset() {
    this.phase = "up";
    this.repCount = 0;
    this.safeReps = 0;
    this.rangeSamples = [];
    this.warnings.clear();
    this.lastRepAt = 0;
  }

  getReps() {
    return this.repCount;
  }

  getSafeReps() {
    return this.safeReps;
  }

  getWarnings() {
    return Array.from(this.warnings);
  }

  getAvgRange() {
    if (!this.rangeSamples.length) return 0;
    return (
      this.rangeSamples.reduce((a, b) => a + b, 0) /
      this.rangeSamples.length
    );
  }

  analyze(landmarks: Point3[]): LiveFormState {
    const angle = measureAngle(
      landmarks,
      this.exercise.metric,
      this.exercise.side
    );
    const { targetRangeMin: min, targetRangeMax: max } = this.exercise;
    const side =
      this.exercise.side === "either"
        ? pickVisibleSide(landmarks, this.exercise.metric)
        : this.exercise.side;

    let status: LiveFormState["status"] = "idle";
    let message = "Get in frame and match the demo motion";

    const inTarget = angle >= min && angle <= max;
    const tooDeep = angle > max + 12;

    if (this.exercise.metric === "knee-flexion") {
      if (kneeOverToeRisk(landmarks, side)) {
        status = "risk";
        message = "Don't let your knee pass your toes";
        this.warnings.add(message);
      }
    }

    if (status !== "risk") {
      if (tooDeep) {
        status = "warn";
        message = "Ease up, you are past a safe range";
        this.warnings.add(message);
      } else if (inTarget) {
        status = "good";
        message = "Good form, stay in the green zone";
      } else if (angle < min - 15) {
        status = "idle";
        message = "Go a little deeper, you are short of your target range";
      } else if (angle < min) {
        status = "warn";
        message = "Almost there, a bit more range";
      } else if (angle > max) {
        status = "warn";
        message = "Pull back slightly into your target range";
      }
    }

    this.trackRep(angle, min, max, status);

    return {
      status,
      message,
      repCount: this.repCount,
      rangeDegrees: Math.round(angle),
      targetMin: min,
      targetMax: max,
    };
  }

  private trackRep(
    angle: number,
    min: number,
    max: number,
    status: LiveFormState["status"]
  ) {
    const now = Date.now();
    const downThreshold = min - 5;
    const upThreshold = Math.max(25, min - 25);

    if (this.phase === "up" && angle >= downThreshold) {
      this.phase = "down";
      this.rangeSamples.push(angle);
    } else if (
      this.phase === "down" &&
      angle <= upThreshold &&
      now - this.lastRepAt > this.cooldownMs
    ) {
      this.phase = "up";
      this.repCount += 1;
      this.lastRepAt = now;
      if (status === "good" || status === "idle") {
        this.safeReps += 1;
      }
    }

    if (this.phase === "down" && angle >= min && angle <= max) {
      this.rangeSamples.push(angle);
    }
  }

  formScore(): number {
    if (this.repCount === 0) return 72;
    const safeRatio = this.safeReps / this.repCount;
    const rangePenalty =
      this.getAvgRange() < this.exercise.targetRangeMin ? 0.12 : 0;
    return Math.round(
      Math.min(100, Math.max(40, safeRatio * 100 - rangePenalty * 100))
    );
  }
}
