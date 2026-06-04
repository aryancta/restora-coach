import type { UserProgress } from "@/types";

export const SEED_PROGRESS: UserProgress = {
  streak: 4,
  lastSessionDate: new Date().toISOString().slice(0, 10),
  totalSessions: 6,
  difficultyByGoal: {
    "knee-rehab": 2,
    "shoulder-mobility": 1,
    "senior-balance": 2,
  },
  sessions: [
    {
      id: "seed-1",
      goalId: "knee-rehab",
      goalTitle: "Knee rehab",
      date: daysAgo(5),
      durationSeconds: 420,
      overallFormScore: 78,
      difficultyLevel: 1,
      exercises: [
        {
          exerciseId: "sit-to-stand",
          exerciseName: "Sit-to-stand",
          repsCompleted: 7,
          repsTarget: 8,
          safeReps: 6,
          formScore: 80,
          avgRangeDegrees: 88,
          targetRangeMin: 75,
          targetRangeMax: 105,
          warnings: [],
        },
      ],
      coachSummary:
        "You showed up and moved with care. Your sit-to-stand depth is improving. Keep the same pace tomorrow.",
      coachTip: "Think about pushing through your heels on the way up.",
    },
    {
      id: "seed-2",
      goalId: "senior-balance",
      goalTitle: "Senior balance",
      date: daysAgo(4),
      durationSeconds: 380,
      overallFormScore: 82,
      difficultyLevel: 2,
      exercises: [
        {
          exerciseId: "chair-rise",
          exerciseName: "Chair rise",
          repsCompleted: 6,
          repsTarget: 6,
          safeReps: 6,
          formScore: 85,
          avgRangeDegrees: 92,
          targetRangeMin: 70,
          targetRangeMax: 105,
          warnings: [],
        },
      ],
      coachSummary:
        "Strong balance session. Chair rises looked steady. Nice work staying consistent.",
      coachTip: "Keep a counter within arm's reach for single-leg balance.",
    },
    {
      id: "seed-3",
      goalId: "knee-rehab",
      goalTitle: "Knee rehab",
      date: daysAgo(3),
      durationSeconds: 450,
      overallFormScore: 84,
      difficultyLevel: 2,
      exercises: [
        {
          exerciseId: "heel-slide",
          exerciseName: "Heel slide",
          repsCompleted: 10,
          repsTarget: 10,
          safeReps: 9,
          formScore: 86,
          avgRangeDegrees: 82,
          targetRangeMin: 60,
          targetRangeMax: 95,
          warnings: ["Move slowly"],
        },
      ],
      coachSummary:
        "Great consistency. Heel slides hit your target range on most reps.",
      coachTip: "Pause for one breath at the deepest comfortable point.",
    },
    {
      id: "seed-4",
      goalId: "shoulder-mobility",
      goalTitle: "Shoulder mobility",
      date: daysAgo(2),
      durationSeconds: 360,
      overallFormScore: 76,
      difficultyLevel: 1,
      exercises: [
        {
          exerciseId: "arm-raise",
          exerciseName: "Controlled arm raise",
          repsCompleted: 9,
          repsTarget: 10,
          safeReps: 8,
          formScore: 74,
          avgRangeDegrees: 78,
          targetRangeMin: 70,
          targetRangeMax: 110,
          warnings: ["No swinging"],
        },
      ],
      coachSummary:
        "You are building shoulder range without forcing it. One more rep of focus on slow control will help.",
      coachTip: "Exhale as you lift, inhale as you lower.",
    },
    {
      id: "seed-5",
      goalId: "senior-balance",
      goalTitle: "Senior balance",
      date: daysAgo(1),
      durationSeconds: 400,
      overallFormScore: 88,
      difficultyLevel: 2,
      exercises: [
        {
          exerciseId: "weight-shift",
          exerciseName: "Weight shift squat",
          repsCompleted: 8,
          repsTarget: 8,
          safeReps: 8,
          formScore: 90,
          avgRangeDegrees: 85,
          targetRangeMin: 65,
          targetRangeMax: 95,
          warnings: [],
        },
      ],
      coachSummary:
        "Excellent session. Weight shifts were smooth and in the safe zone throughout.",
      coachTip: "Try counting to three while holding single-leg balance.",
    },
  ],
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
