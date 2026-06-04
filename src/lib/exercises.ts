import type { GoalId } from "@/types";

export type ExerciseDefinition = {
  id: string;
  name: string;
  description: string;
  repsTarget: number;
  targetRangeMin: number;
  targetRangeMax: number;
  safetyNotes: string[];
  /** Which joint angle to track */
  metric: "knee-flexion" | "shoulder-abduction" | "hip-flexion" | "balance-hold";
  /** Side to prefer when visible */
  side: "left" | "right" | "either";
};

export type GoalDefinition = {
  id: GoalId;
  title: string;
  subtitle: string;
  icon: string;
  clinicalFocus: string;
  exercises: ExerciseDefinition[];
};

export const GOALS: GoalDefinition[] = [
  {
    id: "knee-rehab",
    title: "Knee rehab",
    subtitle: "Post-injury or post-surgery recovery",
    icon: "knee",
    clinicalFocus:
      "Protect the joint while rebuilding range and control. We watch knee flexion and keep your shin from passing your toes.",
    exercises: [
      {
        id: "sit-to-stand",
        name: "Sit-to-stand",
        description:
          "Stand up from a chair slowly, then lower back down with control. Keep knees behind toes.",
        repsTarget: 8,
        targetRangeMin: 75,
        targetRangeMax: 105,
        safetyNotes: [
          "Do not let your knee pass your toes",
          "Keep chest slightly forward",
        ],
        metric: "knee-flexion",
        side: "either",
      },
      {
        id: "heel-slide",
        name: "Heel slide",
        description:
          "Slide your heel along the floor toward you while seated or lying down to bend the knee.",
        repsTarget: 10,
        targetRangeMin: 60,
        targetRangeMax: 95,
        safetyNotes: ["Move slowly", "Stop if you feel sharp pain"],
        metric: "knee-flexion",
        side: "either",
      },
      {
        id: "mini-squat",
        name: "Mini squat",
        description:
          "Small controlled bend at the knees, only as deep as your clinician allows.",
        repsTarget: 8,
        targetRangeMin: 70,
        targetRangeMax: 100,
        safetyNotes: [
          "Stay in a pain-free range",
          "Keep weight through your heels",
        ],
        metric: "knee-flexion",
        side: "either",
      },
    ],
  },
  {
    id: "shoulder-mobility",
    title: "Shoulder mobility",
    subtitle: "Restore safe overhead and side range",
    icon: "shoulder",
    clinicalFocus:
      "Gradual shoulder abduction within a safe arc. We flag if you shrug or swing too fast.",
    exercises: [
      {
        id: "arm-raise",
        name: "Controlled arm raise",
        description:
          "Raise your arm out to the side to shoulder height, palm down, without shrugging.",
        repsTarget: 10,
        targetRangeMin: 70,
        targetRangeMax: 110,
        safetyNotes: ["Lead with the elbow", "No swinging"],
        metric: "shoulder-abduction",
        side: "either",
      },
      {
        id: "forward-flexion",
        name: "Forward reach",
        description:
          "Lift your arm forward to about shoulder height, keeping the movement smooth.",
        repsTarget: 10,
        targetRangeMin: 65,
        targetRangeMax: 100,
        safetyNotes: ["Stop before pain", "Keep ribs down"],
        metric: "shoulder-abduction",
        side: "either",
      },
      {
        id: "pendulum",
        name: "Gentle pendulum",
        description:
          "Lean slightly and let your arm swing in a small circle, using gravity only.",
        repsTarget: 12,
        targetRangeMin: 25,
        targetRangeMax: 55,
        safetyNotes: ["Relax the shoulder", "Small arcs only"],
        metric: "shoulder-abduction",
        side: "either",
      },
    ],
  },
  {
    id: "senior-balance",
    title: "Senior balance",
    subtitle: "Fall prevention and steady stance",
    icon: "balance",
    clinicalFocus:
      "Build confidence standing on one leg and rising from a chair. Have a sturdy surface within reach.",
    exercises: [
      {
        id: "chair-rise",
        name: "Chair rise",
        description:
          "Stand up and sit down from a chair without using your hands if safe for you.",
        repsTarget: 6,
        targetRangeMin: 70,
        targetRangeMax: 105,
        safetyNotes: ["Use chair arms if needed", "Stand near support"],
        metric: "knee-flexion",
        side: "either",
      },
      {
        id: "weight-shift",
        name: "Weight shift squat",
        description:
          "Gentle mini squat shifting weight side to side, holding a counter if needed.",
        repsTarget: 8,
        targetRangeMin: 65,
        targetRangeMax: 95,
        safetyNotes: ["Hold support when needed", "Move slowly"],
        metric: "knee-flexion",
        side: "either",
      },
      {
        id: "single-leg-stand",
        name: "Single-leg balance",
        description:
          "Lift one foot slightly off the floor and hold steady near a counter.",
        repsTarget: 5,
        targetRangeMin: 15,
        targetRangeMax: 45,
        safetyNotes: ["Keep a hand on support", "Stop if you feel dizzy"],
        metric: "balance-hold",
        side: "either",
      },
    ],
  },
];

export function getGoal(goalId: string): GoalDefinition | undefined {
  return GOALS.find((g) => g.id === goalId);
}
