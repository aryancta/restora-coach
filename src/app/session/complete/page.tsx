"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionRecord } from "@/types";
import { loadProgress } from "@/lib/storage";

export default function SessionCompletePage() {
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("restora_last_session");
    if (raw) {
      setSession(JSON.parse(raw) as SessionRecord);
    }
    setStreak(loadProgress().streak);
  }, []);

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">No session data yet.</p>
        <Button className="mt-4" asChild>
          <Link href="/goals">Start a session</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-4 text-3xl font-bold">Session complete</h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-accent-foreground font-semibold">
          <Flame className="h-5 w-5 text-accent" />
          {streak} day streak
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your AI coach</CardTitle>
          <p className="text-sm text-muted-foreground">
            {session.goalTitle} · Form score {session.overallFormScore}%
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">{session.coachSummary}</p>
          {session.coachTip && (
            <div className="rounded-lg bg-secondary p-4 text-sm">
              <p className="font-semibold text-secondary-foreground">
                One thing to try tomorrow
              </p>
              <p className="mt-1 text-secondary-foreground/90">
                {session.coachTip}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {session.exercises.map((e) => (
              <Badge key={e.exerciseId} variant="outline">
                {e.exerciseName}: {e.repsCompleted}/{e.repsTarget} reps (
                {e.formScore}%)
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard">See progress chart</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/goals">Train again tomorrow</Link>
        </Button>
      </div>
    </div>
  );
}
