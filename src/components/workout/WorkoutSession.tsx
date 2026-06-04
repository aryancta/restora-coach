"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Mic, MicOff, Pause, Play } from "lucide-react";
import { PoseCamera } from "@/components/pose/PoseCamera";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GoalDefinition } from "@/lib/exercises";
import { RepDetector } from "@/lib/pose/repDetector";
import type { Point3 } from "@/lib/pose/angles";
import type { ExerciseMetric, LiveFormState, SessionRecord } from "@/types";
import { getGeminiKey } from "@/lib/api-keys";
import {
  adjustDifficulty,
  getDifficulty,
  loadProgress,
  recordSession,
} from "@/lib/storage";
import { buildFallbackCoachSummary } from "@/lib/coach-fallback";
import { speakCue, speakRepCount } from "@/lib/voice";
import { toast } from "sonner";

type Props = {
  goal: GoalDefinition;
};

export function WorkoutSession({ goal }: Props) {
  const router = useRouter();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    const v = localStorage.getItem("restora_voice_default");
    if (v === "false") setVoiceOn(false);
  }, []);
  const [live, setLive] = useState<LiveFormState>({
    status: "idle",
    message: "Press Start to begin your webcam session",
    repCount: 0,
    rangeDegrees: 0,
    targetMin: 0,
    targetMax: 0,
  });
  const [metrics, setMetrics] = useState<ExerciseMetric[]>([]);
  const [finishing, setFinishing] = useState(false);
  const detectorRef = useRef<RepDetector | null>(null);
  const startedAt = useRef<number>(Date.now());
  const lastRep = useRef(0);

  const exercise = goal.exercises[exerciseIndex];
  const difficulty = getDifficulty(goal.id);

  const repsTarget = useMemo(() => {
    const base = exercise.repsTarget;
    if (difficulty === 1) return base;
    if (difficulty === 2) return base + 2;
    return base + 4;
  }, [exercise.repsTarget, difficulty]);

  useEffect(() => {
    detectorRef.current = new RepDetector(exercise);
    detectorRef.current.reset();
    setLive({
      status: "idle",
      message: `Ready: ${exercise.name}`,
      repCount: 0,
      rangeDegrees: 0,
      targetMin: exercise.targetRangeMin,
      targetMax: exercise.targetRangeMax,
    });
    lastRep.current = 0;
  }, [exercise]);

  const onLandmarks = useCallback(
    (landmarks: Point3[]) => {
      if (!active || paused || !detectorRef.current) return;
      const state = detectorRef.current.analyze(landmarks);
      setLive(state);
      if (state.repCount > lastRep.current) {
        lastRep.current = state.repCount;
        speakRepCount(state.repCount, voiceOn);
      }
      if (state.status === "risk") {
        speakCue(state.message, voiceOn);
      }
    },
    [active, paused, voiceOn]
  );

  const finishExercise = () => {
    const det = detectorRef.current;
    const m: ExerciseMetric = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      repsCompleted: det?.getReps() ?? 0,
      repsTarget,
      safeReps: det?.getSafeReps() ?? 0,
      formScore: det?.formScore() ?? 70,
      avgRangeDegrees: Math.round(det?.getAvgRange() ?? 0),
      targetRangeMin: exercise.targetRangeMin,
      targetRangeMax: exercise.targetRangeMax,
      warnings: det?.getWarnings() ?? [],
    };
    const next = [...metrics, m];
    setMetrics(next);
    if (exerciseIndex < goal.exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
      setActive(false);
      toast.success(`${exercise.name} saved. Next exercise ready.`);
    } else {
      void completeSession(next);
    }
  };

  const completeSession = async (allMetrics: ExerciseMetric[]) => {
    setFinishing(true);
    const durationSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    const overallFormScore = Math.round(
      allMetrics.reduce((s, e) => s + e.formScore, 0) / allMetrics.length
    );
    const newDifficulty = adjustDifficulty(goal.id, overallFormScore);
    const progress = loadProgress();
    const streak = progress.lastSessionDate === new Date().toISOString().slice(0, 10)
      ? progress.streak
      : progress.streak + 1;

    let coachSummary: string;
    let coachTip: string;
    let difficultyNote: string;

    const fallback = buildFallbackCoachSummary(
      goal.title,
      goal.id,
      overallFormScore,
      allMetrics,
      streak
    );

    const geminiKey = getGeminiKey();
    if (geminiKey) {
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-gemini-key": geminiKey,
          },
          body: JSON.stringify({
            goalTitle: goal.title,
            goalId: goal.id,
            overallFormScore,
            exercises: allMetrics,
            streak,
            difficulty: newDifficulty,
          }),
        });
        const data = await res.json();
        coachSummary = data.summary ?? fallback.summary;
        coachTip = data.tip ?? fallback.tip;
        difficultyNote = data.difficultyNote ?? fallback.difficultyNote;
      } catch {
        coachSummary = fallback.summary;
        coachTip = fallback.tip;
        difficultyNote = fallback.difficultyNote;
      }
    } else {
      coachSummary = fallback.summary;
      coachTip = fallback.tip;
      difficultyNote = fallback.difficultyNote;
    }

    const session: SessionRecord = {
      id: `session-${Date.now()}`,
      goalId: goal.id,
      goalTitle: goal.title,
      date: new Date().toISOString().slice(0, 10),
      durationSeconds,
      overallFormScore,
      exercises: allMetrics,
      coachSummary: `${coachSummary} ${difficultyNote}`,
      coachTip,
      difficultyLevel: newDifficulty,
    };

    recordSession(session);
    sessionStorage.setItem("restora_last_session", JSON.stringify(session));
    router.push("/session/complete");
  };

  const statusColor =
    live.status === "good"
      ? "good"
      : live.status === "warn"
        ? "warn"
        : live.status === "risk"
          ? "risk"
          : "idle";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <PoseCamera
          active={active && !paused}
          onLandmarks={onLandmarks}
          statusColor={statusColor}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {!active ? (
            <Button size="lg" onClick={() => setActive(true)}>
              <Play className="h-4 w-4" />
              Start webcam
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? "Resume" : "Pause"}
            </Button>
          )}
          <Button
            variant={voiceOn ? "secondary" : "outline"}
            onClick={() => setVoiceOn((v) => !v)}
          >
            {voiceOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            Voice {voiceOn ? "on" : "off"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">
              Exercise {exerciseIndex + 1} of {goal.exercises.length}
            </p>
            <CardTitle>{exercise.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  live.status === "good"
                    ? "safe"
                    : live.status === "risk"
                      ? "risk"
                      : live.status === "warn"
                        ? "warn"
                        : "outline"
                }
              >
                {live.status === "good"
                  ? "Safe zone"
                  : live.status === "risk"
                    ? "Caution"
                    : live.status === "warn"
                      ? "Adjust form"
                      : "Tracking"}
              </Badge>
              <Badge variant="outline">
                Target {live.targetMin}-{live.targetMax} deg
              </Badge>
              <Badge variant="secondary">Level {difficulty}</Badge>
            </div>

            <div
              className={`rounded-lg border-2 p-4 text-lg font-medium ${
                live.status === "good"
                  ? "border-safe bg-emerald-50 text-emerald-900"
                  : live.status === "risk"
                    ? "border-risk bg-red-50 text-red-900"
                    : live.status === "warn"
                      ? "border-warn bg-amber-50 text-amber-900"
                      : "border-border bg-muted"
              }`}
            >
              {live.message}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-2xl font-bold">{live.repCount}</p>
                <p className="text-xs text-muted-foreground">Reps</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-2xl font-bold">
                  {live.repCount}/{repsTarget}
                </p>
                <p className="text-xs text-muted-foreground">Goal</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-2xl font-bold">{live.rangeDegrees}</p>
                <p className="text-xs text-muted-foreground">Range deg</p>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!active || finishing}
              onClick={finishExercise}
            >
              {exerciseIndex < goal.exercises.length - 1
                ? "Next exercise"
                : "Finish session"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          {exercise.safetyNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
