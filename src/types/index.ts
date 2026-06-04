export type GoalId = "knee-rehab" | "shoulder-mobility" | "senior-balance";

export type ExerciseMetric = {
  exerciseId: string;
  exerciseName: string;
  repsCompleted: number;
  repsTarget: number;
  safeReps: number;
  formScore: number;
  avgRangeDegrees: number;
  targetRangeMin: number;
  targetRangeMax: number;
  warnings: string[];
};

export type SessionRecord = {
  id: string;
  goalId: GoalId;
  goalTitle: string;
  date: string;
  durationSeconds: number;
  overallFormScore: number;
  exercises: ExerciseMetric[];
  coachSummary?: string;
  coachTip?: string;
  difficultyLevel: number;
};

export type UserProgress = {
  streak: number;
  lastSessionDate: string | null;
  totalSessions: number;
  difficultyByGoal: Record<GoalId, number>;
  sessions: SessionRecord[];
};

export type LiveFormState = {
  status: "idle" | "good" | "warn" | "risk";
  message: string;
  repCount: number;
  rangeDegrees: number;
  targetMin: number;
  targetMax: number;
};
