import type { GoalId, SessionRecord, UserProgress } from "@/types";
import { SEED_PROGRESS } from "./seed-data";

const PROGRESS_KEY = "restora_progress";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return SEED_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return mergeWithSeed(SEED_PROGRESS);
    const parsed = JSON.parse(raw) as UserProgress;
    if (!parsed.sessions?.length) return mergeWithSeed(parsed);
    return parsed;
  } catch {
    return mergeWithSeed(SEED_PROGRESS);
  }
}

function mergeWithSeed(current: UserProgress): UserProgress {
  if (current.sessions?.length >= 3) return current;
  const ids = new Set(current.sessions.map((s) => s.id));
  const extra = SEED_PROGRESS.sessions.filter((s) => !ids.has(s.id));
  return {
    ...current,
    sessions: [...current.sessions, ...extra].sort((a, b) =>
      a.date.localeCompare(b.date)
    ),
    streak: Math.max(current.streak, SEED_PROGRESS.streak),
    totalSessions: Math.max(
      current.totalSessions,
      current.sessions.length + extra.length
    ),
  };
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function recordSession(session: SessionRecord): UserProgress {
  const progress = loadProgress();
  const today = todayISO();
  const last = progress.lastSessionDate;

  let streak = progress.streak;
  if (last === today) {
    streak = progress.streak;
  } else if (last === yesterdayISO()) {
    streak = progress.streak + 1;
  } else if (!last) {
    streak = 1;
  } else {
    streak = 1;
  }

  const updated: UserProgress = {
    ...progress,
    streak,
    lastSessionDate: today,
    totalSessions: progress.totalSessions + 1,
    difficultyByGoal: {
      ...progress.difficultyByGoal,
      [session.goalId]: session.difficultyLevel,
    },
    sessions: [...progress.sessions, session].slice(-30),
  };
  saveProgress(updated);
  return updated;
}

export function getDifficulty(goalId: GoalId): number {
  const p = loadProgress();
  return p.difficultyByGoal[goalId] ?? 1;
}

export function adjustDifficulty(
  goalId: GoalId,
  formScore: number
): number {
  const current = getDifficulty(goalId);
  if (formScore >= 85) return Math.min(3, current + 1);
  if (formScore < 60) return Math.max(1, current - 1);
  return current;
}
