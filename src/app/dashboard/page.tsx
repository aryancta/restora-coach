"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Flame, TrendingUp } from "lucide-react";
import { loadProgress } from "@/lib/storage";
import type { UserProgress } from "@/types";
import { ProgressChart } from "@/components/ProgressChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
        Loading your progress...
      </div>
    );
  }

  const recent = [...progress.sessions].reverse().slice(0, 5);
  const avgScore =
    progress.sessions.length > 0
      ? Math.round(
          progress.sessions.reduce((s, x) => s + x.overallFormScore, 0) /
            progress.sessions.length
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your recovery progress</h1>
          <p className="mt-1 text-muted-foreground">
            Streaks and form trends help you stay consistent at home.
          </p>
        </div>
        <Button asChild>
          <Link href="/goals">Start session</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent" />
              Current streak
            </CardDescription>
            <CardTitle className="text-4xl">{progress.streak} days</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Total sessions
            </CardDescription>
            <CardTitle className="text-4xl">{progress.totalSessions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Avg form score
            </CardDescription>
            <CardTitle className="text-4xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Form score over time</CardTitle>
          <CardDescription>
            Seeded history shows how the chart looks. Your sessions append here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressChart sessions={progress.sessions} />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recent.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-medium">{s.goalTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {s.date} · {Math.round(s.durationSeconds / 60)} min
                </p>
              </div>
              <Badge variant={s.overallFormScore >= 80 ? "safe" : "outline"}>
                {s.overallFormScore}% form
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
