import type { ExerciseMetric, GoalId } from "@/types";

export function buildFallbackCoachSummary(
  goalTitle: string,
  goalId: GoalId,
  overallFormScore: number,
  exercises: ExerciseMetric[],
  streak: number
): { summary: string; tip: string; difficultyNote: string } {
  const weakest = [...exercises].sort((a, b) => a.formScore - b.formScore)[0];
  const strongest = [...exercises].sort((a, b) => b.formScore - a.formScore)[0];

  const tone =
    overallFormScore >= 85
      ? "You had a really solid session"
      : overallFormScore >= 70
        ? "Nice work showing up today"
        : "Good effort getting through the routine";

  const summary = `${tone} on ${goalTitle}. Overall form score: ${overallFormScore}%. ${
    strongest
      ? `${strongest.exerciseName} looked strongest (${strongest.formScore}%).`
      : ""
  } ${
    weakest && weakest.formScore < 80
      ? `Focus next time on ${weakest.exerciseName}: aim for smoother reps in the green zone.`
      : "Keep the same steady pace tomorrow."
  } ${
    streak > 1
      ? `Your ${streak}-day streak shows real commitment.`
      : "Day 1 is in the books. Come back tomorrow to start your streak."
  }`;

  const tips: Record<GoalId, string> = {
    "knee-rehab":
      "On sit-to-stand, push through your heels and keep your knee behind your toes.",
    "shoulder-mobility":
      "Lead with your elbow on arm raises and avoid shrugging toward your ear.",
    "senior-balance":
      "Stand near a counter for single-leg work and breathe slowly while you hold.",
  };

  const difficultyNote =
    overallFormScore >= 85
      ? "We will gently increase reps or range next session."
      : overallFormScore < 65
        ? "We will ease targets slightly so you can build confidence."
        : "Same difficulty tomorrow so you can lock in the pattern.";

  return {
    summary,
    tip: tips[goalId],
    difficultyNote,
  };
}
